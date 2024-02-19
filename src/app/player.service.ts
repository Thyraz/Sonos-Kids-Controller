import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from './media';
import { SonosApiConfig } from './sonos-api';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { StorageService } from './storage.service';

export enum PlayerCmds {
  PLAY = 'play',
  PAUSE = 'pause',
  PLAYPAUSE = 'playpause',
  PREVIOUS = 'previous',
  NEXT = 'next',
  VOLUMEUP = 'volume/+5',
  VOLUMEDOWN = 'volume/-5',
  CLEARQUEUE = 'clearqueue'
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private config: Observable<SonosApiConfig> = null;

  constructor(private http: HttpClient, private storageService: StorageService) {}

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
      case 'applemusic': {
        if (media.category === 'playlist') {
          url = 'applemusic/now/playlist:' + encodeURIComponent(media.id);
        } else {
          url = 'applemusic/now/album:' + encodeURIComponent(media.id);
        }
        break;
      }
      case 'amazonmusic': {
        if (media.category === 'playlist') {
          url = 'amazonmusic/now/playlist:' + encodeURIComponent(media.id);
        } else {
          url = 'amazonmusic/now/album:' + encodeURIComponent(media.id);
        }
        break;
      }
      case 'library': {
        if (!media.id) {
          media.id = media.title;
        }
        if (media.category === 'playlist') {
          url = 'playlist/' + encodeURIComponent(media.id);
        } else {
          url = 'musicsearch/library/album/' + encodeURIComponent(media.id);
        }
        break;
      }
      case 'spotify': {
        if (media.category === 'playlist') {
          url = 'spotify/now/spotify:user:spotify:playlist:' + encodeURIComponent(media.id);
        } else {
          if (media.id) {
            url = 'spotify/now/spotify:album:' + encodeURIComponent(media.id);
          } else {
            url = 'musicsearch/spotify/album/artist:"' + encodeURIComponent(media.artist) + '" album:"' + encodeURIComponent(media.title) + '"';
          }
        }
        break;
      }
      case 'tunein': {
        url = 'tunein/play/' + encodeURIComponent(media.id);
        break;
      }
    }

    this.sendRequest(url);
  }

  say(text: string) {
    this.getConfig().subscribe(config => {
      let url = 'say/' + encodeURIComponent(text) + '/' + ((config.tts?.language?.length > 0) ? config.tts.language : 'de-de');

      if (config.tts?.volume?.length > 0) {
        url += '/' + config.tts.volume;
      }

      this.sendRequest(url);
    });
  }

 private async sendRequest(url: string) {
 
  // get active room
  let activeRoom = 0;
  await this.storageService.getObject('activeRoom').then(content => {
    activeRoom = Number(content);
  })
 
  await this.getConfig().subscribe(config => {

    // get protocol
    let protocol = "http";
    if(config.useHttps === true) {
        protocol = "https";
    }

    const baseUrl = protocol + '://' + config.server + ':' + config.port + '/' + config.rooms[activeRoom] + '/';
    this.http.get(baseUrl + url).subscribe();
    });
  }
}
