import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
// Should be moved in a compoinent that is then displayed in a page like this
import { MediaService } from '../media.service';
import { Media } from '../media';

@Component({
  selector: 'app-medialist',
  templateUrl: './medialist.page.html',
  styleUrls: ['./medialist.page.scss'],
})
export class MedialistPage implements OnInit {
  @ViewChild('slider', { static: false }) slider: IonSlides;

  media: Media[] = [];

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
    this.mediaService.getMedia().subscribe(media => {
      this.media = media;
    });
  }

  coverClicked(clickedMedia: Media) {
    const navigationExtras: NavigationExtras = {
      state: {
        media: clickedMedia
      }
    };
    this.router.navigate(['/player'], navigationExtras);
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
