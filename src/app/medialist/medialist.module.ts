import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedialistPageRoutingModule } from './medialist-routing.module';

import { MedialistPage } from './medialist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedialistPageRoutingModule
  ],
  declarations: [MedialistPage]
})
export class MedialistPageModule {}
