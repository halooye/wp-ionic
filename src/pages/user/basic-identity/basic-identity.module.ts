import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicIdentityPage } from './basic-identity';

@NgModule({
  declarations: [
    BasicIdentityPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicIdentityPage),
  ],
})
export class BasicIdentityPageModule {}
