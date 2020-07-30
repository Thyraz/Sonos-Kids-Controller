import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { MediaService } from '../media.service';
import { ArtworkService } from '../artwork.service';
import { PlayerService } from '../player.service';
import { ActivityIndicatorService } from '../activity-indicator.service';
import { Artist } from '../artist';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  artists: Artist[] = [];
  covers = {};

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false,
    loop: false,
    freeMode: true,
    freeModeSticky: true,
    freeModeMomentumBounce: false,
    freeModeMomentumRatio: 1.0,
    freeModeMomentumVelocityRatio: 1.0
  };

  constructor(
    private mediaService: MediaService,
    private artworkService: ArtworkService,
    private playerService: PlayerService,
    private activityIndicatorService: ActivityIndicatorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mediaService.getArtists().subscribe(artists => {
      this.artists = artists;

      this.artists.forEach(artist => {
        this.artworkService.getArtwork(artist.coverMedia).subscribe(url => {
          this.covers[artist.name] = url;
        });
      });
      this.slider.update();
    });
  }

  ionViewDidLeave() {
    this.activityIndicatorService.hide();
  }

  coverClicked(clickedArtist: Artist) {
    this.activityIndicatorService.show();

    setTimeout(() => {
      const navigationExtras: NavigationExtras = {
        state: {
          artist: clickedArtist
        }
      };
      this.router.navigate(['/medialist'], navigationExtras);
    }, 50);
  }

  artistNameClicked(clickedArtist: Artist) {
    this.playerService.say(clickedArtist.name);
  }

  slideDidChange() {
    // console{}.log('Slide did change');
  }

  slidePrev() {
    this.slider.slidePrev();
  }

  slideNext() {
    this.slider.slideNext();
  }
}
