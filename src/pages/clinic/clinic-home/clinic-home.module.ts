import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClinicHomePage } from './clinic-home';

@NgModule({
  declarations: [
    ClinicHomePage,
  ],
  imports: [
    IonicPageModule.forChild(ClinicHomePage),
  ],
})
export class ClinicHomePageModule {}
