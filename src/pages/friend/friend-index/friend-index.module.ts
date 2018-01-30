
import { FriendPartnerPageModule } from '../friend-partner/friend-partner.module';
import { JoinPageModule } from '../join/join.module';
import { KnowPageModule } from '../know/know.module';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendIndexPage } from './friend-index';

@NgModule({
  declarations: [
    FriendIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendIndexPage), FriendPartnerPageModule, JoinPageModule, KnowPageModule,
  ],
})
export class FriendIndexPageModule {}
