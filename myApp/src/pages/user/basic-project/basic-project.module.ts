import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicProjectPage } from './basic-project';

@NgModule({
  declarations: [
    BasicProjectPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicProjectPage),
  ],
})
export class BasicProjectPageModule {}
