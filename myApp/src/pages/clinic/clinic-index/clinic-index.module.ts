import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClinicIndexPage } from './clinic-index';

@NgModule({
  declarations: [
    ClinicIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(ClinicIndexPage),
  ]
})
export class ClinicIndexPageModule {}
