import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { DoctorHomePage } from '../../clinic/doctor-home/doctor-home';

@Component({
  selector: 'page-join',
  templateUrl: 'join.html',
})
export class JoinPage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    @Input() items = []; //列表
    i:any;//上拉次数
    @Input() currentPage: number;    //显示当前页面
    isOpacity :boolean = true;//是否有透明度

    constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appService:AppService) {
         this.i = 0;
    }

    ionViewDidLoad() {
        this.init(20,true)
    }

    ionViewDidEnter(){
        this.isOpacity = false
    }

   //刷新更多
  doRefresh(refresher) {
      setTimeout(() => {
          this.init(20,false);
          refresher.complete();
      }, 200);
  }

  //加载更多
  doInfinite(infiniteScroll) {
    this.i++;
    this.init(20+20*this.i,false,data=>{
       infiniteScroll.complete();
    })
  }


  init(count,loader,callback?){
    let data = {
      value : count
    }
    this.appService.httpPost('postNewJoinClinicList','1',data,res=>{
      if(res.code == 0){
        this.items = res.data.dcList;
        if(callback){
          callback(res.data.dcList)
        }
      }
    },loader)
  }



  clinicHome(type, doctor){  // 查看别人诊所链接 操作区域链接
    if(type == "1"){
      this.appService.httpPost('postInvitPartner','2',{id: doctor.doctorId,note:''},res=>{
        if(res.code == 0){
          doctor.isInvited = true;
        }
      });
    }else{
      this.navCtrl.push(DoctorHomePage, {id: doctor.doctorId});
    }
  }

}
