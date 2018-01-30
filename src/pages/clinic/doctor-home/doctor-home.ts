import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AppGlobal, AppService} from "../../../app/app.service";
import { ClinicHomePage } from '../clinic-home/clinic-home';
import { TabsPage } from '../../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ChatHomePage} from "../../chat/chat-home/chat-home";

@IonicPage()
@Component({
    selector: 'page-doctor-home',
    templateUrl: 'doctor-home.html',
})
export class DoctorHomePage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    id: string;
    data:any;//初始化数据
    doctor:any={};
    clinic:any={};
    status:any ={};
    illness:any=[];
    outpatient:any=[];
    morning:any = [];
    afternoon:any = [];
    noon:any = [];
    bgSrc : any ;//背景图片
    myDotorBg:boolean = false;   //我的主页显示编辑背景
    defaultClinic:any;//定义门诊
    clinicColor:any;
    isApply: boolean = true;       //是否已申请
    isInvit: boolean = true;    //是否已邀请

    constructor(
        public navCtrl: NavController,
        private appService:AppService,
        private camera: Camera,
        public actionSheetCtrl: ActionSheetController,
        public navParams: NavParams){
            this.id = navParams.get('id');
            this.defaultClinic=[
                {kind:"普通门诊",color:'#d5d6d9'},
                {kind:"专家门诊",color:'#f281a1'},
                {kind:"特约门诊",color:'#83e3ac'},
                {kind:"特需门诊",color:'#f3a066'},
                {kind:"专病门诊",color:'#66b6f3'},
                {kind:"其它门诊",color:'#d2a7f3'}
            ];
            this.clinicColor=[{time:"上午",stage:0},{time:"下午",stage:1},{time:"夜间",stage:2}];
            this.mkArray(this.morning);
            this.mkArray(this.afternoon);
            this.mkArray(this.noon);

            this.appService.getItem('_bsxq_userId', rs =>{
                if(this.id === rs){
                    this.myDotorBg = true;
                }
            });
    }

    //定义array
    mkArray(array){
        let isShow;
        for(let i =0;i<7;i++){
          array.push({week:i+1,isShow:false,color:''})
        }
    }

    doRefresh(refresher){
        setTimeout(() => {
            this.init(this.id);
            refresher.complete();
        }, 200);
    }

    ionViewDidLoad(){
        this.init(this.id)
    }

    goBack(){   //返回
        this.navCtrl.pop();
    }

    cliinHome(){    //进入诊所
        this.appService.getItem('_bsxq_userId', rs =>{
            if(this.id === rs){
                this.navCtrl.push(TabsPage, {tabId:3});
            }else{
                this.navCtrl.push(ClinicHomePage,{id:this.clinic.id});
            }
        });
    }

    //初始化
    init(id,callback?){
         this.appService.httpPost('postDoctorHome','0',{id:id},res=>{
              if(res.code == 0){
                this.data = res.data
                this.doctor = res.data.doctor
                this.clinic = res.data.clinic
                this.illness = res.data.illness
                this.outpatient = res.data.outpatient
                this.status = res.data.status;

                if(!res.data.doctor.bgImage){
                  this.bgSrc = 'url(assets/imgs/doctor@3x.png)';
                }else {
                  this.bgSrc = 'url('+ AppGlobal.imgurl + res.data.doctor.bgImage + ')';
                }

                this.outpatient.forEach((data1, index1, array1)=> {
                     this.defaultClinic.forEach((data2, index2, array2)=>{
                       if(data1.stage==0 && data1.kind==data2.kind){
                          this.morning[data1.week-1].isShow=true;
                          this.morning[data1.week-1].color=data2.color;
                          return
                       }else if(data1.stage==1 && data1.kind==data2.kind){
                         this.afternoon[data1.week-1].isShow=true;
                         this.afternoon[data1.week-1].color=data2.color;
                         return
                       }else if(data1.stage==2 && data1.kind==data2.kind){
                         this.noon[data1.week-1].isShow=true;
                         this.noon[data1.week-1].color=data2.color;
                       }
                     })
                })
                if(callback){
                  callback()
                }
              }
         }, true)
    }

    //上传图片
    uploadBg(){

        let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: '拍照',
              // role: 'destructive',
              handler: () => {
                this.uploadCamera(this.camera.PictureSourceType.CAMERA)
              }
            },
            {
              text: '从相册选择',
              handler: () => {
                this.uploadCamera(this.camera.PictureSourceType.PHOTOLIBRARY)
              }
            },
            {
              text: '取消',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        });
        actionSheet.present();
    }

    uploadCamera(type){
        const options: CameraOptions = {
            quality: 100,
            targetWidth: 750,
            // targetHeight: 136,
            saveToPhotoAlbum: false,
            sourceType: type,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation:true
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.appService.httpPost('postCoctorBg','1', {base64: imageData}, rs => {
                if(rs.code == 0){
                    this.bgSrc = 'url('+base64Image+')';
                }
            });
        }, (err) => {
            this.appService.presentToast(err.message,'middle')
        });
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

    sendMsg(){
        this.navCtrl.push(ChatHomePage, {
                id: this.data.doctor.id,
                introInfo: this.data.doctor.title,
                headImg: this.data.doctor.faceImage,
                senderName: this.data.doctor.name,
                hospital: this.data.doctor.hospital
            })
    }

}
