import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MediaService } from '../media.service';
import { Media } from '../media';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  @ViewChild('options_slider', { static: false }) optionsSlider: IonSlides;

  media: Media[] = [];

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
    public alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    // Subscribe
    this.mediaService.getRawMediaObservable().subscribe(media => {
      this.media = media;
    });

    // Retreive data through subscription above
    this.mediaService.updateRawMedia();
  }

  async deleteButtonPressed(index: number) {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Warning',
      message: 'Do you want to delete the selected item from your library?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.mediaService.deleteRawMediaAtIndex(index);
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });

    await alert.present();
  }

  addButtonPressed() {
    this.router.navigate(['/add']);
  }
}
