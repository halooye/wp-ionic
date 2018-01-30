import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatIndexPage } from './chat-index';

@NgModule({
  declarations: [
    ChatIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatIndexPage)
  ]
})
export class ChatIndexPageModule {}
