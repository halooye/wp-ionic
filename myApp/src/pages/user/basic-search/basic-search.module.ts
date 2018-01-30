import { NgModule } from '@angular/core';
import { IonicPageModule,IonicModule } from 'ionic-angular';
import { BasicSearchPage } from './basic-search';


@NgModule({
  declarations: [
    BasicSearchPage
  ],
  imports: [
    IonicPageModule.forChild(BasicSearchPage),
    IonicModule.forRoot(BasicSearchPage, {
      monthNames: ['北京', '上海', '天津'] ,
      monthShortNames: ['jan', 'fev', 'mar'],
      dayNames: ['北京', '上海', '天津'] ,
      dayShortNames: ['dom', 'seg', 'ter']
    })
  ],
})
export class BasicSearchPageModule {}
