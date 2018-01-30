import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommomProblemPage } from './commom-problem';

@NgModule({
  declarations: [
    CommomProblemPage,
  ],
  imports: [
    IonicPageModule.forChild(CommomProblemPage),
  ],
})
export class CommomProblemPageModule {}
