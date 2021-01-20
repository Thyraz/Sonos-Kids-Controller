import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, iif, Subject } from 'rxjs';
import { map, mergeMap, tap, toArray, mergeAll } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SpotifyService } from './spotify.service';
import { Media } from './media';
import { Artist } from './artist';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private media: Media[] = null;
  private mediaSubject = new Subject<Media[]>();

  private rawMediaSubject = new Subject<Media[]>();

  constructor(
    private http: HttpClient,
    private spotifyService: SpotifyService,
  ) { }

  // --------------------------------------------
  // Handling of RAW media entries from data.json
  // --------------------------------------------

  getRawMediaObservable(): Subject<Media[]> {
    return this.rawMediaSubject;
  }

  updateRawMedia() {
    const url = (environment.production) ? '../api/data' : 'http://localhost:8200/api/data';
    this.http.get<Media[]>(url).subscribe(media => {
        this.rawMediaSubject.next(media);
    });
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

  // ------------------------------------------------------------------------------------------
  // Handling of displayed media (Queries from RAW media expanded to single artists and albums)
  // ------------------------------------------------------------------------------------------

  getMediaObservable(): Subject<Media[]> {
    return this.mediaSubject;
  }

  // Get the media data from the server
  updateMedia() {
    const url = (environment.production) ? '../api/data' : 'http://localhost:8200/api/data';

    this.http.get<Media[]>(url).pipe(
      mergeMap(items => from(items)), // parallel calls for each item
      map((item) => // check if current item is a single album or a query for multiple items
        iif(
          () => (item.query && item.query.length > 0) ? true : false,
          this.spotifyService.getAlbumsForQuery(item.query).pipe(
            map(items => {  // If the user entered an user-defined artist name in addition to a query, overwrite orignal artist from spotify
              if (item.artist?.length > 0) {
                items.forEach(currentItem => {
                  currentItem.artist = item.artist;
                });
              } 
              return items;
            })
          ),
          iif(
            () => (item.type == 'spotify' && item.id && item.id.length > 0) ? true : false,
            this.spotifyService.getAlbumForID(item.id).pipe(
              map(currentItem => {  // If the user entered an user-defined artist or album name in addition to an id, overwrite values from spotify
                if (item.artist?.length > 0) {
                  currentItem.artist = item.artist;
                }
                if (item.title?.length > 0) {
                  currentItem.title = item.title;
                }
                return [currentItem];
              })
            ),
            of([item]) // return single albums also as array, so we always have the same data type
          )
        ),
      ),
      mergeMap(items => from(items)), // seperate arrays to single observables
      mergeAll(), // merge everything together
      toArray() // convert to array
    ).subscribe(media => {
      this.media = media;
      this.mediaSubject.next(media);
    });
  }

  // Publish cached media or get new data if no chached media is available
  publishCachedMedia() {
    if (this.media) {
      this.mediaSubject.next(this.media);
    } else {
      this.updateMedia();
    }
  }

  // Get all artists
  getArtists(): Observable<Artist[]> {
    return this.getMediaObservable().pipe(
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
    return this.getMediaObservable().pipe(
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
}
