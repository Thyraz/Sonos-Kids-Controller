import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
// Should be moved in a compoinent that is then displayed in a page like this
import { MediaService } from '../media.service';
import { ArtworkService } from '../artwork.service';
import { PlayerService } from '../player.service';
import { Artist } from '../artist';
import { Media } from '../media';
import { Observable, observable } from 'rxjs';

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
    loop: false
  };

  constructor(
    private mediaService: MediaService,
    private artworkService: ArtworkService,
    private playerService: PlayerService,
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
