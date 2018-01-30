import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KnowPage } from './know';

@NgModule({
  declarations: [
    KnowPage,
  ],
  imports: [
    IonicPageModule.forChild(KnowPage),
  ],
})
export class KnowPageModule {}
