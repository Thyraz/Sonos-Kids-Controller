import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, publishReplay, refCount } from 'rxjs/operators';
import { Media } from './media';
import { Artist } from './artist';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private media: Observable<Media[]> = null;

  constructor(private http: HttpClient) { }

  // Get the media data from the server
  getMedia(): Observable<Media[]> {
    // Observable with caching:
    // publishReplay(1) tells rxjs to cache the last response of the request
    // refCount() keeps the observable alive until all subscribers unsubscribed
    // To clear the cache, set 'this.media = null;'
    if (!this.media) {
      this.media = this.http.get<Media[]>('../api/data').pipe(
      publishReplay(1),
      refCount()
     );
    }

    return this.media;
  }

  clearCache() {
    this.media = null;
  }

  // Get all artists
  getArtists(): Observable<Artist[]> {
    return this.getMedia().pipe(
      map((media: Media[]) => {
        // Create temporary object with artist as key and albumCount as value
        const albumCounts = media.reduce((tempCounts, currentMedia) => {
          tempCounts[currentMedia.artist] = (tempCounts[currentMedia.artist] || 0) + 1;
          return tempCounts;
        }, {});

        // Build Array of Artist objects sorted by Artist name
        const artists: Artist[] = Object.keys(albumCounts).sort().map(currentName => {
          const artist: Artist = {
            name: currentName,
            albumCount: albumCounts[currentName]
          };
          return artist;
        });

        return artists;
      })
    );
  }

  // Collect albums from a given artist
  getMediaFromArtist(artist: Artist): Observable<Media[]> {
    return this.getMedia().pipe(
      map((media: Media[]) => {
        return media.filter(currentMedia => currentMedia.artist === artist.name).sort((a, b) => a.title.localeCompare(b.title));
      })
    );
  }
}
