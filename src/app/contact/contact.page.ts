import { Component, OnInit } from '@angular/core';
// Shoudl be moved in a compoinent that is then displayed in a page like this
import { MediaService } from '../media.service';
import { PlayerService } from '../player.service';
import { Media } from '../media';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  media: Media[] = [];

  constructor(
    private mediaService: MediaService,
    private playerService: PlayerService,
  ) {}

  ngOnInit() {
    // Retrieve data from the API
    this.mediaService.getMedia().subscribe(media => {
      this.media = media;
      console.log(this.media[0]);



      // Test: Set volume of player after loading data
      // this.playerService.play();
    });
  }
}
