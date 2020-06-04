import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter, publishReplay, refCount } from 'rxjs/operators';
import { Media } from './media';

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
      this.media = this.http.get<Media[]>('http://localhost:8200/api/data').pipe(
      publishReplay(1),
      refCount()
     );
    }

    return this.media;
  }

  clearCache() {
    this.media = null;
  }

  // Collect all artists and remove duplicates
  getArtists(): Observable<string[]> {
    return this.getMedia().pipe(
      map((media: Media[]) => {
        const allArtists = media.map(currentMedia => currentMedia.artist);
        const uniqueArtists = Array.from(new Set(allArtists)).sort();
        return uniqueArtists;
      })
    );
  }

  // Collect albums from a given artist
  getMediaFromArtist(artist: string): Observable<Media[]> {
    return this.getMedia().pipe(
      map((media: Media[]) => {
        return media.filter(currentMedia => currentMedia.artist === artist).sort((a, b) => a.title.localeCompare(b.title));
      })
    );
  }
}
