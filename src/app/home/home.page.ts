import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { MediaService } from '../media.service';
import { ArtworkService } from '../artwork.service';
import { PlayerService } from '../player.service';
import { ActivityIndicatorService } from '../activity-indicator.service';
import { Artist } from '../artist';
import { Media } from '../media';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('artist_slider', { static: false }) artistSlider: IonSlides;
  @ViewChild('media_slider', { static: false }) mediaSlider: IonSlides;

  category =  'audiobook';

  artists: Artist[] = [];
  media: Media[] = [];
  covers = {};
  activityIndicatorVisible = false;
  optionsButtonclickCount = 0;
  optionsClickTimer = 0;

  needsUpdate = false;

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
    this.mediaService.setCategory('audiobook');

    // Subscribe
    this.mediaService.getMedia().subscribe(media => {
      this.media = media;

      this.media.forEach(currentMedia => {
        this.artworkService.getArtwork(currentMedia).subscribe(url => {
          this.covers[currentMedia.title] = url;
        });
      });
      this.mediaSlider?.update();

      // Workaround as the scrollbar handle isn't visible after the immediate update
      // Seems like a size calculation issue, as resizing the browser window helps
      // Better fix for this? 
      window.setTimeout(() => {
        this.mediaSlider?.update();
      }, 1000);
    });

    this.mediaService.getArtists().subscribe(artists => {
      this.artists = artists;

      this.artists.forEach(artist => {
        this.artworkService.getArtwork(artist.coverMedia).subscribe(url => {
          this.covers[artist.name] = url;
        });
      });
      this.artistSlider?.update();

      // Workaround as the scrollbar handle isn't visible after the immediate update
      // Seems like a size calculation issue, as resizing the browser window helps
      // Better fix for this? 
      window.setTimeout(() => {
        this.artistSlider?.update();
      }, 1000);
    });

    this.update();
  }

  ionViewWillEnter() {
    if (this.needsUpdate) {
      this.update();
    }
  }

  ionViewDidLeave() {
    if (this.activityIndicatorVisible) {
      this.activityIndicatorService.dismiss();
      this.activityIndicatorVisible = false;
    }
  }

  categoryChanged(event: any) {
    this.category = event.detail.value;
    this.mediaService.setCategory(this.category);
    this.update();
  }

  update() {
    if (this.category === 'audiobook' || this.category === 'music') {
      this.mediaService.publishArtists();
    } else {
      this.mediaService.publishMedia();
    }
    this.needsUpdate = false;
  }

  artistCoverClicked(clickedArtist: Artist) {
    this.activityIndicatorService.create().then(indicator => {
      this.activityIndicatorVisible = true;
      indicator.present().then(() => {
        const navigationExtras: NavigationExtras = {
          state: {
            artist: clickedArtist
          }
        };
        this.router.navigate(['/medialist'], navigationExtras);
      });
    });
  }

  artistNameClicked(clickedArtist: Artist) {
    this.playerService.getConfig().subscribe(config => {
      if (config.tts == null || config.tts.enabled === true) {
        this.playerService.say(clickedArtist.name);
      }
    });
  }

  mediaCoverClicked(clickedMedia: Media) {
    const navigationExtras: NavigationExtras = {
      state: {
        media: clickedMedia
      }
    };
    this.router.navigate(['/player'], navigationExtras);
  }

  mediaNameClicked(clickedMedia: Media) {
    this.playerService.getConfig().subscribe(config => {
      if (config.tts == null || config.tts.enabled === true) {
        this.playerService.say(clickedMedia.title);
      }
    });
  }

  optionsButtonPressed() {
    window.clearTimeout(this.optionsClickTimer);

    if (this.optionsButtonclickCount < 9) {
      this.optionsButtonclickCount++;

      this.optionsClickTimer = window.setTimeout(() => {
        this.optionsButtonclickCount = 0;
      }, 500);
    } else {
      this.router.navigate(['/settings']);
      this.optionsButtonclickCount = 0;
      this.needsUpdate = true;
    }
  }
}
