import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from './media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  media: Media[] = [];

  constructor(private http: HttpClient) { }

  // TODO: Request Caching wie hier beschrieben:
  // https://www.syntaxsuccess.com/viewarticle/caching-with-rxjs-observables-in-angular-2.0

  // Get the media data from the server
  getMedia(): Observable<Media[]> {
    return this.http.get<Media[]>('http://localhost:8200/api/data');
  }

  // TODO: Umbauen damit Observable zurück gegeben wird:
  // https://stackoverflow.com/questions/50809542/return-an-observable-by-mapping-another-observable

  // colllect all artists
  getArtists(): Observable<string[]> {
    this.getMedia().subscribe()

    const allArtists = this.media.map(media => media.artist);
    const uniqueArtists = Array.from(new Set(allArtists));

    return uniqueArtists;
  }

  getMediaFromArtist(artist: string) {
    return this.media.filter(media => media.artist == artist);
  }
}
