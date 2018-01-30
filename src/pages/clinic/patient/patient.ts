import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";

@IonicPage()
@Component({
  selector: 'page-patient',
  templateUrl: 'patient.html',
})
export class PatientPage {
  items:any;//列表
  i:any;//上拉次数
  noData: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appService :AppService) {
            this.items=[];
            this.i=0
  }

  ionViewDidLoad() {
    this.appService.httpPost('postPatientList','1',{value:20},res=>{
      if(res.code == 0){
          this.items = res.data;
          if(res.data.length > 0){
              this.noData = true;
          }
      }
    }, true)
  }

  //刷新更多
  doRefresh(refresher) {
    console.log('开始异步操作', refresher);

    this.appService.httpPost('postPatientList','1',{value:20},res=>{
      if(res.code == 0){
        this.items = res.data;
        refresher.complete();
      }
    })
  }
  //加载更多
  doInfinite(infiniteScroll) {
    this.i++;
    this.appService.httpPost('postPatientList', '1', {value:20+20*this.i}, res=>{
      if(res.code == 0){
        this.items=res.data;
        infiniteScroll.complete();
      }
    });
  }

}
