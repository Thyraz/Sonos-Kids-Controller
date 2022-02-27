import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PlayerService } from '../player.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  constructor(
    private playerService: PlayerService,
    private storageService: StorageService,
    public alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    // Init storage if does not exist
    this.storageService.isKey('activeRoom').then(retval => { 
      if(retval == false) {
        this.storageService.setObject('activeRoom', 0);
      }
    });
  }

  addButtonPressed() {
    this.router.navigate(['/add']);
  }

  async selectRoomAlert() {

    let input={data:[]};

    // get active room
    let activeRoom = 0; // by default the first one
    await this.storageService.getObject('activeRoom').then(content => {
      activeRoom = Number(content);
    })

    // generate dynamic radion button group
    await this.playerService.getConfig().subscribe(config => {

      for (let i=0; i < config.rooms.length; i++) {
        let isChecked = false;

        if(activeRoom == i) { 
          isChecked = true; 
        }

        input.data.push({
          name:config.rooms[i],
          type: 'radio',
          label:config.rooms[i],
          value:i,
          checked:isChecked,
          handler: (pressedButton) => {
            this.storageService.setObject('activeRoom',pressedButton.value );
          } 
        });
      }
    });

    // show selection windows
    const alert = await this.alertController.create({
      cssClass: 'radio-alert',
      header: 'Select room',
      inputs: input.data,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  };
}

