import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, iif, Subscriber } from 'rxjs';
import { map, publishReplay, refCount, mergeMap, tap, toArray, mergeAll } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SpotifyService } from './spotify.service';
import { Media } from './media';
import { Artist } from './artist';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private media: Observable<Media[]> = null;

  private rawMedia: Observable<Media[]> = null;
  private rawMediaSubscriber: Subscriber<unknown> = null;

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService,
  ) { }

  getRawMedia(): Observable<Media[]> {
    this.rawMedia = new Observable(observer => {
      this.rawMediaSubscriber = observer;
      this.updateRawMedia();

      return {unsubscribe() {}};
    });

    return this.rawMedia;
  }

  private updateRawMedia() {
    const url = (environment.production) ? '../api/data' : 'http://localhost:8200/api/data';
    this.http.get<Media[]>(url).subscribe(media => {
        this.rawMediaSubscriber?.next(media);
    });
  }

  // Get the media data from the server
  getMedia(): Observable<Media[]> {
    // Observable with caching:
    // publishReplay(1) tells rxjs to cache the last response of the request
    // refCount() keeps the observable alive until all subscribers unsubscribed
    // To clear the cache, set 'this.media = null;'
    if (!this.media) {
      const url = (environment.production) ? '../api/data' : 'http://localhost:8200/api/data';

      this.media = this.http.get<Media[]>(url).pipe(
        mergeMap(items => from(items)), // parallel calls for each item
        map((item) => // check if current item is a single album or a query for multiple items
          iif(
            () => (item.query && item.query.length > 0) ? true : false,
            this.spotifyService.getAlbumsForQuery(item.query),
            of([item]) // return single albums also as array, so we always have the same data type
          ),
        ),
        mergeMap(items => from(items)), // seperate arrays to single observables
        mergeAll(), // merge everything together
        toArray(), // convert to array
        publishReplay(1), // cache result
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
        return media
          .filter(currentMedia => currentMedia.artist === artist.name)
          .sort((a, b) => a.title.localeCompare(b.title, undefined, {
            numeric: true,
            sensitivity: 'base'
          }));
      })
    );
  }

  deleteRawMediaAtIndex(index: number) {
    const url = (environment.production) ? '../api/delete' : 'http://localhost:8200/api/delete';
    const body = {
      index
    };

    this.http.post(url, body).subscribe(response => {
      this.updateRawMedia();
    });
  }

  addRawMedia(media: Media) {
    const url = (environment.production) ? '../api/add' : 'http://localhost:8200/api/add';

    this.http.post(url, media).subscribe(response => {
      this.updateRawMedia();
    });
  }
}
