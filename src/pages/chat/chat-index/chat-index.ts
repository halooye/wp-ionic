import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,Events } from 'ionic-angular';
import { ConnectPage } from "../connect/connect";
import { AppService,AppGlobal } from "../../../app/app.service";
import { ChatHomePage } from "../chat-home/chat-home";
import { Storage } from '@ionic/storage';
import { JPushService } from 'ionic2-jpush';
import { DatePipe } from '@angular/common';
import {BaiqiuyingPage} from "../../user/baiqiuying/baiqiuying";

@IonicPage()
@Component({
  selector: 'page-chat-index',
  templateUrl: 'chat-index.html',
  providers: [DatePipe]
})
export class ChatIndexPage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径

    list:any = [];
    userId:any = [];//用户自己的ID
    connectList : any ;//给connect页传的参数
    connectCount:any ;// 申请邀请数
    baiqiuying:any;//白球鹰数据
    msgCount:any = null;//未读消息条数
    isOpenClinic:Boolean //是否开通诊所
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private appService:AppService,
                private storage: Storage,
                private jPushPlugin: JPushService,
                public platform:Platform,
                private datePipe:DatePipe,
                public events: Events) {
      this.appService.getItem('_bsxq_openClinic',data=>{
        this.isOpenClinic = data
      })
      this.appService.getItem('_bsxq_userId', rs =>{
        this.userId = rs;
      });
      this.baiqiuying = {
        'senderName':'白球鹰',
        'introInfo':'',
        'hospital':'',
        'senderId':'wp123456789',
        'sendTime': null,
        'headImg' : null,
        'type'  : null,
        'content' : '',
        "chatType":'chat',
      }
    }
   ionViewDidLoad(){
      // this.publishEvents(this.msgCount)
   }


    publishEvents(count) {
      this.events.publish('msgCount',count, Date.now());
    }

    ionViewWillLeave(){
        // this.putStorage()
    }

    ionViewWillEnter() {
        // this.storage.ready().then(() => {
        //   this.storage.clear()
        // })
        if(this.isOpenClinic) {
          this.init()
          this.initHttp()
        }else {
          this.init()
        }
      }


    doRefresh(refresher) {
        if(this.isOpenClinic){
          this.initHttp(function () {
            refresher.complete();
          })
        }
    }

    delete(item,index){
       let data = {
         id:item.senderId
       }
       this.appService.httpPost('postDelChatList','0',data,res=>{
          if(res.code == 0){
            this.list.splice(index,1)
            this.putStorage()
          }
       })
    }


    ondrag(e,item) {
      let percent = e.getSlidingPercent();
      if (Math.abs(percent) > 1) {
        e.endSliding();
      }
    }

  goConnect(item){
      this.navCtrl.push(ConnectPage,{data:this.connectList})
      item.msgCount = null;
      this.putStorage()
  }
  goChat(item){
    if(item.senderId == 'wp123456789'){
      this.navCtrl.push(BaiqiuyingPage);
      this.putStorage();
      return;
    }
    this.navCtrl.push(ChatHomePage,{id:item.senderId,introInfo:item.introInfo,headImg:item.headImg,senderName:item.senderName,hospital:item.hospital})
    item.msgCount = null;
    this.putStorage();
  }

  putStorage(){
    this.storage.ready().then(() => {
      this.storage.set('_bsxq_chatList'+this.userId,this.list)
    })
  }


  //初始化  定义List是否存在
  init(){
    this.storage.ready().then(() => {
      // Or to get a key/value pair
      this.storage.get('_bsxq_chatList'+this.userId).then(val => {
         if(val){
           this.list = val
         }else {
           this.list = []
           this.list.push(this.baiqiuying)
         }
      })
    });
    // this.list = [
    //   {
    //     "senderName": "马冬梅",
    //     "introInfo":'主治医师',
    //     "msgCount": 1,
    //     "senderId": "d01ed82d91204f438ce4f34b916a8e5a",
    //     "sendTime": 1513150281000,
    //     "content": "测试消息发送1",
    //     "headImg": null,
    //     "type": 1,
    //     "chatType":'chat'
    //   }
    // ]
  }

  //拉取列表数据进行比对
  initHttp(callback?){
    this.appService.httpPost('postChatList','0','',(res)=>{
      if(res.code == 0){
        let chatLength:number = 0  //聊天的未读消息数
        if( res.data.msgList.length>0){
          res.data.msgList.forEach((val1, idx1, array1) => {
            this.list.forEach((val2, idx2, array2) => {
              if(val1.senderId == val2.senderId){
                array2.splice(idx2,1)
              }
            })
          });
          res.data.msgList.forEach((val, idx, array) => {
            val.chatType = 'chat'
            if(val.type == 2){
              val.content = '[图片]'
            }else if(val.type == 3){
              val.content = '[电话]'
            }else if(val.type == 7){
              val.content = '[卡片]'
            }else if(val.type == 8){
              val.content = '[系统消息]'
            }
            this.list.unshift(val)
            chatLength = chatLength + val.msgCount
          })
        }
        this.msgCount = res.data.unreadAppInvCount + chatLength
        this.publishEvents(this.msgCount)

        this.connectList = res.data.appInvList
        if(res.data.appInvList.length > 0){
          if(this.list.length > 0){
            this.list.forEach((val, idx, array) => {
              if(val.chatType == 'connection'){
                array.splice(idx,1)
              }
            })
          }
          let connectData = {
            chatType :'connection',
            msgCount : res.data.unreadAppInvCount,
            sendTime : res.data.appInvList[0].createTime
          };
          this.list.unshift(connectData);
          this.connectCount = res.data.appInvList.length
        }

        let flag = false ;// 判断白球鹰账号是否存在
        this.list.forEach((val, idx, array) => {
          if(val.senderId == 'wp123456789'){
            flag = true
          }
          if(val.sendTime){
            // 今天
            let todayEncode = new Date(res.date);
            todayEncode.setHours(0);
            todayEncode.setMinutes(0);
            todayEncode.setSeconds(0);
            todayEncode.setMilliseconds(0);
            let today = todayEncode.getTime()
            let oneday :any = 1000 * 60 * 60 * 24;
            let yesterday :any = today  - oneday
            let lastday : any = today - oneday -oneday
            let year = todayEncode.getFullYear()
            let nowYear = new Date(year,1,1,0,0).getTime()

            //小于20分钟时
            if((res.date-val.sendTime)/1000/60/60*3<=1){
              if(Math.floor((res.date-val.sendTime)/1000/60)<=1){
                val.lastTime="刚刚"
              }else{
                val.lastTime= Math.floor((res.date-val.sendTime)/1000/60)+"分钟前"
              }
            }
            //大于20分钟小于24小时
            else if((res.date-val.sendTime)/1000/60/60*3>1 && (res.date-val.sendTime)/1000/60/60<=24){
              if(val.sendTime < today){
                val.lastTime="昨天"+this.datePipe.transform(val.sendTime, 'HH:mm');
              }else {
                val.lastTime = this.datePipe.transform(val.sendTime, 'HH:mm');
              }
            }
            //大于24小时
            else {
                // 今年以前
               if(Math.floor(nowYear-val.sendTime)>0){
                 val.lastTime = this.datePipe.transform(val.sendTime, 'yyyy-MM-dd');
               }else {
                 if(Math.floor(val.sendTime-yesterday)>0){
                   val.lastTime="昨天"+this.datePipe.transform(val.sendTime, 'HH:mm');
                 } else if(Math.floor(val.sendTime-yesterday)<0 && Math.floor(val.sendTime-lastday)>0){
                   val.lastTime="前天"+this.datePipe.transform(val.sendTime, 'HH:mm');
                 }else {
                   val.lastTime = this.datePipe.transform(val.sendTime, 'MM月dd日 HH:mm');
                 }
               }
            }
          }else {
             val.lastTime = null
          }
        })
        if(!flag){
          this.list.unshift(this.baiqiuying)
        }

        this.list.sort(function(a,b){
          return b.sendTime - a.sendTime
        });
        this.putStorage()
        if(callback){
          callback()
        }
      }
    })
  }
}
