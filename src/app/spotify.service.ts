import { Injectable } from '@angular/core';
import { Observable, defer, throwError, of, range } from 'rxjs';
import { retryWhen, flatMap, tap, delay, take, map, mergeMap, mergeAll, toArray } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpotifyAlbumsResponse, SpotifyAlbumsResponseItem } from './spotify';
import { Media } from './media';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: any;
  refreshingToken = false;

  constructor(private http: HttpClient) {
    const SpotifyWebApi = require('../../src/app/spotify-web-api.js');
    this.spotifyApi = new SpotifyWebApi();
  }

  getAlbumsForQuery(query: string): Observable<Media[]> {
    const albums = defer(() => this.spotifyApi.searchAlbums(query, { limit: 1, offset: 0, market: 'DE' })).pipe(
      retryWhen(errors => {
        return errors.pipe(
          flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
          tap(_ => {
            if (!this.refreshingToken) {
              this.refreshToken();
              this.refreshingToken = true;
            }
          }),
          delay(500),
          take(10)
        );
      }),
      map((response: SpotifyAlbumsResponse) => response.albums.total),
      mergeMap(count => range(0, Math.ceil(count / 50))),
      mergeMap(multiplier => defer(() => this.spotifyApi.searchAlbums(query, { limit: 50, offset: 50 * multiplier, market: 'DE' })).pipe(
        retryWhen(errors => {
          return errors.pipe(
            flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
            tap(_ => {
              if (!this.refreshingToken) {
                this.refreshToken();
                this.refreshingToken = true;
              }
            }),
            delay(500),
            take(10)
          );
        }),
        map((response: SpotifyAlbumsResponse) => {
          return response.albums.items.map(item => {
            const media: Media = { id: item.id, artist: item.artists[0].name, title: item.name, cover: item.images[0].url, type: 'spotify'};
            return media;
          });
        })
      )),
      mergeAll(),
      toArray()
    );

    return albums;
  }
  
  // Only used for Unique ID entries with "type: spotify" in the database.
  getAlbumForID(id: string): Observable<Media> {
    const album = defer(() => this.spotifyApi.getAlbum(id, { limit: 1, offset: 0, market: 'DE' })).pipe(
      retryWhen(errors => {
        return errors.pipe(
          flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
          tap(_ => {
            if (!this.refreshingToken) {
              this.refreshToken();
              this.refreshingToken = true;
            }
          }),
          delay(500),
          take(10)
        );
      }),
      map((response: SpotifyAlbumsResponseItem) => {
        const media: Media = { id: response.id, artist: response.artists[0].name, title: response.name, cover: response.images[0].url, type: 'spotify'};
            return media;
      })
    );
    return album;
  }

  // Only used for single "artist + title" entries with "type: spotify" in the database.
  // Artwork for spotify search queries are already fetched together with the initial searchAlbums request 
  getAlbumArtwork(artist: string, title: string): Observable<string> {
    const artwork = defer(() => this.spotifyApi.searchAlbums('album:' + title + ' artist:' + artist, { market: 'DE' })).pipe(
      retryWhen(errors => {
        return errors.pipe(
          flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
          tap(_ => {
            if (!this.refreshingToken) {
              this.refreshToken();
              this.refreshingToken = true;
            }
          }),
          delay(500),
          take(10)
        );
      }),
      map((response: SpotifyAlbumsResponse) => {
        return response?.albums?.items?.[0]?.images?.[0]?.url || '';
      })
    );

    return artwork;
  }

  refreshToken() {
    const tokenUrl = (environment.production) ? '../api/token' : 'http://localhost:8200/api/token';

    this.http.get(tokenUrl, {responseType: 'text'}).subscribe(token => {
      this.spotifyApi.setAccessToken(token);
      this.refreshingToken = false;
    });
  }
}