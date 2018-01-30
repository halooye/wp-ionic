import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,Navbar,ActionSheetController,Events } from 'ionic-angular';
import {BasicIntroducePage} from "../basic-introduce/basic-introduce";
import {BasicProjectPage} from "../basic-project/basic-project";
import {AppService,AppGlobal} from "../../../app/app.service";
import {BasicPage} from "../basic/basic";
import {BasicIdentityPage} from "../basic-identity/basic-identity";
import {DoctorHomePage} from "../../clinic/doctor-home/doctor-home";
import {Camera, CameraOptions} from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

    @ViewChild(Navbar)
    navBar: Navbar;
    flag:boolean;
    items:any;
    outpatientInfo:any;//门诊信息
    patientRoom:any;//病房信息
    faceImages:any;//头像
    introduction:any;//个人简介
    basic:any;//医院与职务
    isBasic:Boolean;//是否填写过医院与职务
    illnessName:any;//擅长项目
    identifyStatus:any;//身份认证状态
    isAdimin:boolean;//是否是行政部
    username:any;//预留姓名
    isShow:boolean = false;
    userId:string;//用户Id
    illness:string;//填写的疾病字符串
    imgUrl: string = AppGlobal.imgurl;   //图片url全路径

  constructor(
        public navCtrl: NavController,
        // public events: Events,
        private appService:AppService,
        private camera:Camera,
        public actionSheetCtrl: ActionSheetController,
        public events:Events){
        this.flag = true;

        // events.subscribe('content:doctor', content => {  //个人简介修改成功并提示
        //     this.introduction = content;
        //     console.log(content);
        //     this.appService.presentToast('个人简介修改成功', 'middle');
        // });
        this.appService.getItem('_bsxq_userId',data=>{
          this.userId = data;
        })
    }

  ionViewDidLoad() {
    // this.navBar.backButtonClick = (e:UIEvent)=>{       //返回提示
      // this.navCtrl.push(TabsPage, {tabId:3});
    // }
  }

    ionViewWillEnter(){
        this.appService.httpPost('postDoctorIndex','0','',res=>{
            if(res.code == 0){
                this.items = res.data;
                this.isShow = true;
                this.outpatientInfo = this.items.outpatientInfo;
                this.patientRoom = this.items.patientRoom;
                this.faceImages =  AppGlobal.imgurl + res.data.faceImage;
                this.introduction = this.items.introduction;
                this.isBasic = this.items.department;

                if(this.items.department.departmentId == '' && this.items.department.departmentFunctionId=='' && this.items.department.hospitalId==''){
                    this.isBasic = false;
                }else{
                    this.isBasic = true;
                }

                this.illnessName = this.items.illnessName;

                if(this.illnessName[0]!=undefined){
                    this.illness=this.illnessName.join(',');
                }

                this.identifyStatus = this.items.identifyStatus;
                this.username = this.items.doctorName;
            }
        });
    }


    uploadPhoto(){  // 点击选择拍照方式
      // this.events.publish('click',{});
        let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: '拍照',
              // role: 'destructive',
              handler: () => {
                this.openCamera(this.camera.PictureSourceType.CAMERA)
              }
            },
            {
              text: '从相册选择',
              handler: () => {
                this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY)
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


    openCamera(method){     //获取相机

        const options: CameraOptions = {
            //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
            //保存的图片格式： JPEG = 0, PNG = 1
            targetWidth: 400,
            //照片宽度
            targetHeight: 400,
            //照片高度
            allowEdit: true, //在选择之前允许修改截图
            saveToPhotoAlbum: true ,  //保存进手机相册
            quality: 100,                                                  //相片质量 0 -100
            destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation:true,//防止照片旋转
            sourceType: method         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.appService.httpPost('postUserPhoto','1', {base64: imageData}, res => {
                if(res.code == 0){
                  this.faceImages = base64Image;
                  this.appService.presentToast('上传成功','bottom');
                }
            })
        }, (err) => {
            this.appService.presentToast(err.message,'middle')
        });
    }


    //点击医院与职务
    goBasic(){
      this.putStorage()
      this.navCtrl.push(BasicPage,{data:'3'})
    }

    // 点击个人主页
    goHome(){
      this.navCtrl.push(DoctorHomePage, {id: this.userId});
    }

    //点击个人简介
    goIntroduce(){
        this.navCtrl.push(BasicIntroducePage, {type: '2', title: '编辑个人简介', content: this.introduction, jsonName: 'postDoctorIntroduce'});
    }

    //点击擅长项目
    goProject(){
      this.navCtrl.push(BasicProjectPage)
    }
    //点击认证
    goIdentity(){
        if(this.items.department.departmentCode=='A05'){
          this.isAdimin=true
        }else {
          this.isAdimin=false
        }
        this.navCtrl.push(BasicIdentityPage,{username:this.username,isAdmin:this.isAdimin,source:'2',state:this.identifyStatus,msg:this.items.identifyRemarks})
    }


  //存缓存
  putStorage(){
     //职级
      let data1 = {
        level: this.items.department.departmentName,
        id: this.items.department.departmentId
        // minPrice:this.minPrice
      }
      this.appService.setItem('_bsxq_level',data1)

     //部门
      let data2 = {
        id: this.items.department.departmentCode
      }
      this.appService.setItem('_bsxq_department',data2)

      //科室
      let clinicId;
      if(this.items.department.departmentCode=='A05'){
         clinicId = ''
      }else {
        clinicId = this.items.department.departmentFunctionId
      }
      let data3= {
        clinic:this.items.department.departmentFunctionName,
        id:clinicId
      }
      this.appService.setItem('_bsxq_clinic', data3);

      //医院
      let data4 = {
        hospital:this.items.department.hospitalName,
        id:this.items.department.hospitalId
      }
      this.appService.setItem('_bsxq_hospital', data4);
  }
}
