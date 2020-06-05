import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
// Should be moved in a compoinent that is then displayed in a page like this
import { MediaService } from '../media.service';
import { Artist } from '../artist';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  artists: Artist[] = [];

  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false
  };

  constructor(
    private mediaService: MediaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mediaService.getArtists().subscribe(artists => {
      this.artists = artists;
    });
  }

  coverClicked(clickedArtist: Artist) {
    const navigationExtras: NavigationExtras = {
      state: {
        artist: clickedArtist
      }
    };
    this.router.navigate(['/medialist'], navigationExtras);
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
