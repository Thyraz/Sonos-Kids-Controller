import { Component, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import { Media } from '../media';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  media: Media[] = [];

  constructor(
    private mediaService: MediaService
  ) { }

  ngOnInit() {
    this.mediaService.getRawMedia().subscribe(media => {
      this.media = media;
    });
  }

}
