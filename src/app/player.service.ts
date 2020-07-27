import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from './media';
import { environment } from '../environments/environment';

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

  constructor(private http: HttpClient) { }

  getState() {
    this.sendRequest('state');
  }

  sendCmd(cmd: PlayerCmds) {
    this.sendRequest(cmd);
  }

  playMedia(media: Media) {
    let url: string;

    // TODO: Create abstract MusicService class and subclasses like Amazon, Spotify, Local library, ...
    // instead of building these URLs here
    switch (media.type) {
      case 'amazon': {
        url = 'amazonmusic/now/album:' + media.id;
        break;
      }
      case 'library': {
        url = 'musicsearch/library/album/' + media.id;
        break;
      }
      case 'spotify': {
        // http://sonos-controller.fritz.box:5005/bad/musicsearch/spotify/album/folge%201%20das%20fohlen
        if (!media.id) {
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
    // Todo: Read node-http url and room names from config file
    const room = (environment.production) ? 'laurin' : 'bad';
    const baseUrl = 'http://sonos-controller.fritz.box:5005/' + room + '/';

    console.log(baseUrl + url);

    this.http.get(baseUrl + url).subscribe();
  }
}
