import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from './media';

export enum PlayerCmds {
  PLAY = 'play',
  PAUSE = 'pause',
  PLAYPAUSE = 'playpause',
  PREVIOUS = 'previous',
  NEXT = 'next',
  VOLUMEUP = 'volume/+10',
  VOLUMEDOWN = 'volume/-10'
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
    }

    this.sendRequest(url);
  }

  private sendRequest(url: string) {
    // Todo: Read node-http url and room names from config file
    const baseUrl = 'http://sonos-controller.fritz.box:5005/bad/';

    this.http.get(baseUrl + url);
  }
}
