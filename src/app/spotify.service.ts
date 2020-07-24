import { Injectable } from '@angular/core';
import { Observable, defer, throwError, of } from 'rxjs';
import { retryWhen, flatMap, tap, delay, take, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ArtworkResponse } from './artwork';

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

    this.getAlbumsForQuery('artist:Bibi Blocksberg');
  }

  getAlbumsForQuery(query: string) {
    const albums = defer(() => this.spotifyApi.searchAlbums(query, { limit: 50, offset: 0 })).pipe(
      retryWhen(errors => {
        return errors.pipe(
          flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
          tap(_ => {
            if (!this.refreshingToken) {
              this.refreshToken();
              this.refreshingToken = true;
              console.log('401 Authorization error. Refreshing token');
            }
          }),
          delay(500),
          take(10)
        );
      }),
      map((response: ArtworkResponse) => {
        if (
          'albums' in response
          &&
          'items' in response.albums
          &&
          response.albums.items.length > 0
        ) {
          console.log(response);
        }
      })
    )
    .subscribe();
  }

  getAlbumArtwork(artist: string, title: string): Observable<string> {
    const artwork = defer(() => this.spotifyApi.searchAlbums('album:' + title + ' artist:' + artist)).pipe(
      retryWhen(errors => {
        return errors.pipe(
          flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
          tap(_ => {
            if (!this.refreshingToken) {
              this.refreshToken();
              this.refreshingToken = true;
              console.log('401 Authorization error. Refreshing token');
            }
          }),
          delay(500),
          take(10)
        );
      }),
      map((response: ArtworkResponse) => {
        if (
          'albums' in response
          &&
          'items' in response.albums
          &&
          response.albums.items.length > 0
          &&
          'images' in response.albums.items[0]
          &&
          response.albums.items[0].images.length > 0
          &&
          'url' in response.albums.items[0].images[0]
        ) {
          return response.albums.items[0].images[0].url;
        } else {
          // Return default "Missing Cover" image path instead of empty string?
          return '';
        }
      })
    );

    return artwork;
  }

  refreshToken() {
    const tokenUrl = (environment.production) ? '../api/token' : 'http://localhost:8200/api/token';

    this.http.get(tokenUrl, {responseType: 'text'}).subscribe(token => {
      console.log('Token:' + token);
      this.spotifyApi.setAccessToken(token);
      this.refreshingToken = false;
    });
  }
}
