import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicSearchProjectPage } from './basic-search-project';

@NgModule({
  declarations: [
    BasicSearchProjectPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicSearchProjectPage),
  ],
})
export class BasicSearchProjectPageModule {}
