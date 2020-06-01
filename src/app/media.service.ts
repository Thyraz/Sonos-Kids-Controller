import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from './media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  // Get all data from the API
  getMedia(): Observable<Media[]> {
    return this.http.get<Media[]>('http://localhost:8080/api/data');
  }
}
