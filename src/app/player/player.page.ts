import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PlayerService, PlayerCmds } from '../player.service';
import { Media } from '../media';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  media: Media;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.media = this.router.getCurrentNavigation().extras.state.media;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.media) {
      console.log(this.media.artist + ' - ' + this.media.title);
      this.playerService.playMedia(this.media);
    }
  }

  ionViewWillLeave() {
    this.playerService.sendCmd(PlayerCmds.PAUSE);
  }

}
