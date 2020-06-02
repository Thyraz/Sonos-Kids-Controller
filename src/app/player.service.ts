import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from './media';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  playMedia(media: Media) {
    // TODO: Create abstract MusicService class and subclasses like Amazon, Spotify, Local library, ...
    // instead of building these URLs here
    let url: string;

    switch (media.type) {
      case 'amazon': {
        url = 'http://sonos-controller.fritz.box:5005/bad/amazonmusic/now/album:' + media.id;
        break;
      }
    }

    this.http.get(url).subscribe(response => {
      console.log(response);
    });

  }
}
