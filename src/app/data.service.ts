import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  // Get all data from the API
  getAllData() {
    return this.http.get('/api/data');
      //.map(res => res.json());
  }

}
