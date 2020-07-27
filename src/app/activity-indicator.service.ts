import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  constructor(
    public loadingController: LoadingController
  ) { }

  show() {
    this.loadingController.create({
      mode: 'ios',
      spinner: 'circles'
    }).then((res) => {
      res.present();
    });
  }

  hide() {
    this.loadingController.dismiss();
  }
}
