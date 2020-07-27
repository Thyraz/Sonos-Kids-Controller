import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './media';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(
      private spotifyService: SpotifyService
  ) { }

  getArtwork(media: Media): Observable<string> {
    let artwork: Observable<string>;

    if (media.cover) {
      artwork = new Observable((observer) => {
        // observable execution
        observer.next(media.cover);
      });
    } else {
      artwork = this.spotifyService.getAlbumArtwork(media.artist, media.title);
    }

    return artwork;
  }
}
