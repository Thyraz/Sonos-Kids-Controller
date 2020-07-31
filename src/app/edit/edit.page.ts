import { Component, OnInit } from '@angular/core';
import { MediaService } from '../media.service';
import { Media } from '../media';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  media: Media[] = [];

  constructor(
    private mediaService: MediaService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.refreshMedia();
  }

  refreshMedia() {
    this.mediaService.getRawMedia().subscribe(media => {
      this.media = media;
      console.log("Received new media list");
    });
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

}
