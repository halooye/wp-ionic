import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicCalculateModalPage } from './basic-calculate-modal';

@NgModule({
  declarations: [
    BasicCalculateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicCalculateModalPage),
  ],
})
export class BasicCalculateModalPageModule {}
