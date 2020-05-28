import { Component, OnInit } from '@angular/core';
// Shoudl be moved in a compoinent that is then displayed in a page like this
import { DataService } from '../data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  data: any = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // Retrieve data from the API
    this.dataService.getAllData().subscribe(data => {
      this.data = data;
      console.log(this.data[0]);
    });
  }
}
