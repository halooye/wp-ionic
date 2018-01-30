import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleIndexPage } from './schedule-index';

@NgModule({
  declarations: [
    ScheduleIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleIndexPage),
  ],
})
export class ScheduleIndexPageModule {}
