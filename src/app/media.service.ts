import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { environment } from '../environments/environment';
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
      const url = (environment.production) ? '../api/data' : 'http://localhost:8200/api/data';

      this.media = this.http.get<Media[]>(url).pipe(
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
        // Create temporary object with artists as keys and albumCounts as values
        const mediaCounts = media.reduce((tempCounts, currentMedia) => {
          tempCounts[currentMedia.artist] = (tempCounts[currentMedia.artist] || 0) + 1;
          return tempCounts;
        }, {});

        // Create temporary object with artists as keys and covers (first media cover) as values
        const covers = media.sort((a, b) => a.title <= b.title ? -1 : 1).reduce((tempCovers, currentMedia) => {
            if (!tempCovers[currentMedia.artist]) { tempCovers[currentMedia.artist] = currentMedia.cover; }
            return tempCovers;
        }, {});

        // Create temporary object with artists as keys and first media as values
        const coverMedia = media.sort((a, b) => a.title <= b.title ? -1 : 1).reduce((tempMedia, currentMedia) => {
          if (!tempMedia[currentMedia.artist]) { tempMedia[currentMedia.artist] = currentMedia; }
          return tempMedia;
      }, {});

        // Build Array of Artist objects sorted by Artist name
        const artists: Artist[] = Object.keys(mediaCounts).sort().map(currentName => {
          const artist: Artist = {
            name: currentName,
            albumCount: mediaCounts[currentName],
            cover: covers[currentName],
            coverMedia: coverMedia[currentName]
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
