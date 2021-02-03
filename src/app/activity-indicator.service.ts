import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActivityIndicatorService {

  constructor(
    public loadingController: LoadingController
  ) { }

  create(): Promise<HTMLIonLoadingElement> {
    return this.loadingController.create({
      mode: 'ios',
      spinner: 'circles'
    });
  }

  dismiss() {
    this.loadingController.dismiss();
  }
}
