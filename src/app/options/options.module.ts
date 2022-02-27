import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OptionsPageRoutingModule } from './options-routing.module';
import { OptionsPage } from './options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionsPageRoutingModule
  ],
  declarations: [OptionsPage]
})
export class OptionsPageModule {}
