import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicClinicPage } from './basic-clinic';

@NgModule({
  declarations: [
    BasicClinicPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicClinicPage),
  ],
})
export class BasicClinicPageModule {}
