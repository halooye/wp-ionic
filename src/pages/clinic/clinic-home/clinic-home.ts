import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PartnerPage } from '../partner/partner';
import { AppGlobal, AppService } from "../../../app/app.service";
import {DoctorHomePage} from "../doctor-home/doctor-home";
import {ChatHomePage} from "../../chat/chat-home/chat-home";

@IonicPage()
@Component({
    selector: 'page-clinic-home',
    templateUrl: 'clinic-home.html',
})
export class ClinicHomePage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径

    id: string;
    data: any;
    doctor:any ={};
    clinic:any ={};
    partner:any ={};
    status:any ={};
    doctorsCount:any;  //诊所人数
    idDheight:boolean = true;
    arrow: string = 'arrow-down';   // 箭头图标变量
    dlist: boolean; // 是否一开始全显示
    isVp: boolean = true;  //合伙人少于三个不显示
    aboutus: string; //诊所理念
    viewNote: boolean = false; //是否显示查看更多
    isOpacity :boolean = true;//是否有透明度
    isApply: boolean = true;       //是否已申请
    isInvit: boolean = true;    //是否已邀请
    isHisPartner: boolean = true;
    isMyPartner: boolean = false;

    constructor(
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        public navParams: NavParams,
        private appService:AppService){
            this.id = navParams.get('id');
            console.log(this.id);
    }


  ionViewWillEnter(){
    this.arrow = 'arrow-down'
    this.idDheight = true
  }
  ionViewDidEnter(){
    this.isOpacity = false;
  }


    doRefresh(refresher) {
      console.log('开始异步操作', refresher);
      this.init(this.id,false,function () {
        refresher.complete();
      })
    }

    ionViewDidLoad() {
        this.init(this.id,true)
    }

    viewAll(note){
        let alert = this.alertCtrl.create({
            title: '诊所理念',
            message: note,
            buttons: ["关闭"]
        });
        alert.present();
    }

    viewPartner(id){  //查看全部合伙人
      this.navCtrl.push(PartnerPage, {id: id, userId: this.doctor.id});
    }

    goBack(){
        this.navCtrl.pop();
    }

  init(id,loader,callback?){
    let data = {
        id : id,
    }
    this.appService.httpPost('postClinicHome','0',data,res=>{
      if(res.code == 0){
        this.data = res.data;
        this.doctor = res.data.doctor;
        this.clinic = res.data.clinic;
        this.status = res.data.status;

        this.partner = res.data.partner;
        this.doctorsCount=0;
        for (let i of this.partner.departmentFunction) {
          this.doctorsCount = this.doctorsCount + Number(i.departmentFunctionCount)
        }

        if(res.data.partner.departmentFunction.length < 6){
          this.dlist = true;
        }else{
          this.dlist = false;
        }

        if(res.data.partner.departmentFunction.length < 4){
            this.isVp = false;
        }

        if(res.data.clinic.note.length < 37){
            this.aboutus = res.data.clinic.note;
        }else{
            this.viewNote = true;
            this.aboutus = res.data.clinic.note.substring(0,36)+"...";
        }

        if(callback){
          callback()
        }
      }
      }, true)
  }

  doctorHome(id){  // 查看别人主页链接
    this.navCtrl.push(DoctorHomePage, {id: id});
  }

  opened(){  //去他的主页
    this.navCtrl.push(DoctorHomePage, {id: this.doctor.id});
  }

  departmentMore(){  //显示全部科室事件
    if(this.idDheight){
      this.idDheight = false;
      this.arrow = 'arrow-up';
    }else{
      this.idDheight = true;
      this.arrow = 'arrow-down';
    }
  }

  sendMsg(){
      this.navCtrl.push(ChatHomePage,{id:this.data.doctor.id,introInfo:this.data.doctor.title,headImg:this.data.doctor.faceImage,senderName:this.data.doctor.name,hospital:this.data.doctor.hospital})
  }

  invitPartner(id,name){
      if(this.isInvit){
          this.appService.httpPost('postInvitPartner','2',{id:id, note:''},res=>{
            if(res.code == 0){
                this.isInvit = false;
                this.appService.presentToast('邀请 '+name+' 加入我的诊所, 发送成功', 'middle');
            }
          });
      }

  }
  applyPartner(id,name){
      if(this.isApply){
          this.appService.httpPost('postApplyPartner','2',{id: id, note: ''},res=>{
              if(res.code == 0){
                  this.isApply = false;
                  this.appService.presentToast('申请加入 '+name+' 的诊所, 发送成功', 'middle');
              }
          });
      }
  }

  secondPrompt(name){
      this.appService.presentToast('点击下方申请或邀请按钮与 '+name+' 成为合伙人', 'middle');
  }

}
