import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from './media';
import { SonosApiConfig } from './sonos-api'
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

export enum PlayerCmds {
  PLAY = 'play',
  PAUSE = 'pause',
  PLAYPAUSE = 'playpause',
  PREVIOUS = 'previous',
  NEXT = 'next',
  VOLUMEUP = 'volume/+5',
  VOLUMEDOWN = 'volume/-5'
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private config: Observable<SonosApiConfig> = null;

  constructor(private http: HttpClient) {}

  getConfig() {
    // Observable with caching:
    // publishReplay(1) tells rxjs to cache the last response of the request
    // refCount() keeps the observable alive until all subscribers unsubscribed
    if (!this.config) {
      const url = (environment.production) ? '../api/sonos' : 'http://localhost:8200/api/sonos';

      this.config = this.http.get<SonosApiConfig>(url).pipe(
        publishReplay(1), // cache result
        refCount()
      );
    }

    return this.config;
  }

  getState() {
    this.sendRequest('state');
  }

  sendCmd(cmd: PlayerCmds) {
    this.sendRequest(cmd);
  }

  playMedia(media: Media) {
    let url: string;

    switch (media.type) {
      case 'amazon': {
        url = 'amazonmusic/now/album:' + media.id;
        break;
      }
      case 'library': {
        if (!media.id) {
          media.id = media.title;
        }
        url = 'musicsearch/library/album/' + media.id;
        break;
      }
      case 'spotify': {
        // Prefer media.id, as the user can overwrite the artist name with a user-defined string when using an id
        if (media.id) { 
          url = 'spotify/now/spotify:album:' + media.id;
        } else {
          url = 'musicsearch/spotify/album/artist:"' + media.artist + '" album:"' + media.title + '"';
        }
        break;
      }
    }

    this.sendRequest(url);
  }

  say(text: string) {
    const url = 'say/' + text + '/de-de';
    this.sendRequest(url);
  }

  private sendRequest(url: string) {
    this.getConfig().subscribe(config => {
      const baseUrl = 'http://' + config.server + ':' + config.port + '/' + config.rooms[0] + '/';
      this.http.get(baseUrl + url).subscribe();
    });
  }
}
