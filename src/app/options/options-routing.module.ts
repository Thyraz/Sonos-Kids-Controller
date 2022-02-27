import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionsPage } from './options.page';

const routes: Routes = [
  {
    path: '',
    component: OptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionsPageRoutingModule {}
