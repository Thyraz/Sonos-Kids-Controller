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
  activityIndicatorVisible = false;
  editButtonclickCount = 0;
  editClickTimer = 0;

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
    // Subscribe
    this.mediaService.getArtists().subscribe(artists => {
      this.artists = artists;

      this.artists.forEach(artist => {
        this.artworkService.getArtwork(artist.coverMedia).subscribe(url => {
          this.covers[artist.name] = url;
        });
      });
      this.slider.update();
    });

    // Retreive data through subscription above
    this.mediaService.publishCachedMedia();
  }

  ionViewDidLeave() {
    if (this.activityIndicatorVisible) {
      this.activityIndicatorService.hide();
      this.activityIndicatorVisible = false;
    }
  }

  coverClicked(clickedArtist: Artist) {
    this.activityIndicatorService.show();
    this.activityIndicatorVisible = true;

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
    this.playerService.getConfig().subscribe(config => {
  	  if (config.tts == null || config.tts.enabled == true) {
	      this.playerService.say(clickedArtist.name);
	    }
    });
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

  editButtonPressed() {
    window.clearTimeout(this.editClickTimer);

    if (this.editButtonclickCount < 9) {
      this.editButtonclickCount++;
      
      this.editClickTimer = window.setTimeout(() => {
        this.editButtonclickCount = 0;
      }, 500);
    } else {
      this.router.navigate(['/edit']);
      this.editButtonclickCount = 0;
    }
  }
}
