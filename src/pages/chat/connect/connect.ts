import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService} from "../../../app/app.service";
import {DoctorHomePage} from "../../clinic/doctor-home/doctor-home";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-connect',
  templateUrl: 'connect.html',
})
export class ConnectPage {
  items:any;
  userId:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appService : AppService,
              private storage: Storage,) {
    this.appService.getItem('_bsxq_userId', rs =>{
      this.userId = rs;
    });
  }

  ionViewDidLoad() {
    this.appService.httpPost('postReadConnectList','0','',res=>{
      console.log(res)
      if(res.code == 0){
         this.items = this.navParams.get('data')
         for(let i of this.items){
           i.state = false
           i.flag = false
         }
         console.log(this.items)
      }
    })
  }


  //同意申请
  apply(doctor,index){
    if(!doctor.flag){
      doctor.flag = true;
      this.appService.httpPost('postAgreeApply','1',{id: doctor.docId},res=>{
        if(res.code == 0){
          doctor.state = true;
          doctor.flag = false;
          this.storage.ready().then(() => {
            this.storage.get('_bsxq_chatList'+this.userId).then(data =>{
              let flag = false
              data.forEach((val, idx, array) => {
                 if(val.senderId == doctor.docId){
                    flag = true;
                   val.senderName= doctor.docName;
                   val.introInfo=doctor.departmentFunctionName;
                   val.msgCount= val.msgCount+1;
                   val.senderId= doctor.docId;
                   val.sendTime= res.date;
                   val.content= "系统消息";
                   val.headImg= doctor.docImg;
                   val.type= 8;
                   val.chatType='chat'
                 }
              })
              if(!flag){
                data.push({
                  "senderName": doctor.docName,
                  "introInfo":doctor.departmentFunctionName,
                  "msgCount": 1,
                  "senderId": doctor.docId,
                  "sendTime": res.date,
                  "content": "系统消息",
                  "headImg": doctor.docImg,
                  "type": 8,
                  "chatType":'chat'
                })
              }
              this.storage.set('_bsxq_chatList'+this.userId,data)
            })
          })
        }
      });
    }
  }


  //同意邀请
  invit(doctor,index){
    if(!doctor.flag) {
      doctor.flag = true
      this.appService.httpPost('postAgreeInvit', '1', {id: doctor.docId}, res => {
        if (res.code == 0) {
          doctor.state = true
          doctor.flag = false
          this.storage.ready().then(() => {
            this.storage.get('_bsxq_chatList'+this.userId).then(data =>{
              let flag = false
              data.forEach((val, idx, array) => {
                if(val.senderId == doctor.docId){
                  flag = true;
                  val.senderName= doctor.docName;
                  val.introInfo=doctor.departmentFunctionName;
                  val.msgCount= val.msgCount+1;
                  val.senderId= doctor.docId;
                  val.sendTime= res.date;
                  val.content= "系统消息";
                  val.headImg= doctor.docImg;
                  val.type= 8;
                  val.chatType='chat'
                }
              })
              if(!flag){
                data.push({
                  "senderName": doctor.docName,
                  "introInfo":doctor.departmentFunctionName,
                  "msgCount": 1,
                  "senderId": doctor.docId,
                  "sendTime": res.date,
                  "content": "系统消息",
                  "headImg": doctor.docImg,
                  "type": 8,
                  "chatType":'chat'
                })
              }
              this.storage.set('_bsxq_chatList'+this.userId,data)
            })
          })
        }
      });
    }
  }

  //跳转个人主页
  doctorHome(doctor){
    this.navCtrl.push(DoctorHomePage,{id: doctor.docId})
  }
}
