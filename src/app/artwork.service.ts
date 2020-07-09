import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Media } from './media';
import { ArtworkResponse } from './artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(private http: HttpClient) { }

  getArtwork(media: Media): Observable<string> {
    let artwork: Observable<string>;

    if (media.cover) {
      artwork = new Observable((observer) => {
        // observable execution
        observer.next(media.cover);
      });
    } else {
      const url = 'https://itunes.apple.com/search?entity=album&country=de&term=' + media.artist + ' ' + media.title;
      artwork =  this.http.jsonp(url, 'callback').pipe(
        map((response: ArtworkResponse) => {
          if ('results' in response && response.results.length > 0 && 'artworkUrl100' in response.results[0]) {
            const newUrl = response.results[0].artworkUrl100.replace('100x100', '500x500');
            return newUrl;
          } else {
            // Return default "Missing Cover" image path instead of empty string?
            return '';
          }
        })
      );
    }

    return artwork;
  }
}
