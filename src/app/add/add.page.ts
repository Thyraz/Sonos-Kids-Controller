import { Component, OnInit } from '@angular/core';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  source: string = "spotify";

  constructor() { }

  ngOnInit() {
  }

  segmentChanged(event) {
    this.source = event.detail.value;
  }

  submit(form) {

  }

}
