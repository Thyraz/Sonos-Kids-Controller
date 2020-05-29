import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  play() {
    // http://sonos-controller.fritz.box:5005/bad/volume/
    // http://sonos-controller.fritz.box:5005/bad/amazonmusic/now/album:B07C2M88D8

    this.http.get('http://sonos-controller.fritz.box:5005/bad/amazonmusic/now/album:B07C2M88D8').subscribe(response => {
      console.log(response);
    });
  }
}
