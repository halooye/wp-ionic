import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicIntroducePage } from './basic-introduce';

@NgModule({
  declarations: [
    BasicIntroducePage,
  ],
  imports: [
    IonicPageModule.forChild(BasicIntroducePage),
  ],
})
export class BasicIntroducePageModule {}
