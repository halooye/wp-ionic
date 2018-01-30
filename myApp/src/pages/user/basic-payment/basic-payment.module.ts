import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicPaymentPage } from './basic-payment';

@NgModule({
  declarations: [
    BasicPaymentPage
  ],
  imports: [
    IonicPageModule.forChild(BasicPaymentPage)
  ],
})
export class BasicPaymentPageModule {}
