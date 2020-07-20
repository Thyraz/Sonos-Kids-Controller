import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, interval, throwError, of, defer } from 'rxjs';
import { map, retryWhen, flatMap, delay, take, tap } from 'rxjs/operators';
import { Media } from './media';
import { ArtworkResponse } from './artwork';
import { environment } from '../environments/environment';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  spotifyApi: any;

  constructor(private http: HttpClient) {
    const SpotifyWebApi = require('../../src/app/spotify-web-api.js');
    this.spotifyApi = new SpotifyWebApi();
  }

  getArtwork(media: Media): Observable<string> {
    let artwork: Observable<string>;

    if (media.cover) {
      artwork = new Observable((observer) => {
        // observable execution
        observer.next(media.cover);
      });
    } else {
      artwork = defer(() => this.spotifyApi.searchAlbums('album:' + media.title + ' artist:' + media.artist)).pipe(
        retryWhen(errors => {
          return errors.pipe(
            flatMap((error) => (error.status !== 401) ? throwError(error) : of(error)),
            tap(_ => this.refreshToken()),
            delay(100),
            take(50)
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
            'url' in response.albums.items[0].images[0]
          ) {
            console.log(response.albums.items[0].images[0].height + ' ' + response.albums.items[0].images[0].url);
            return response.albums.items[0].images[0].url;
          } else {
            // Return default "Missing Cover" image path instead of empty string?
            return '';
          }
        })
      );
    }

    return artwork;
  }

  refreshToken() {
    const tokenUrl = (environment.production) ? '../api/token' : 'http://localhost:8200/api/token';

    this.http.get(tokenUrl, {responseType: 'text'}).subscribe(token => {
      console.log('Token:' + token);
      this.spotifyApi.setAccessToken(token);
    });
  }
}
