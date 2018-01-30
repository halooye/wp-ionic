import { Component,ViewChild,ElementRef,Renderer2  } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar,LoadingController,ActionSheetController  } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {AppService,AppGlobal} from "../../../app/app.service";
import {TabsPage} from "../../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-basic-identity',
  templateUrl: 'basic-identity.html',
})
export class BasicIdentityPage {
  username:string;
  @ViewChild(Navbar)
  navBar: Navbar;
  @ViewChild('photo1')
  photo1:ElementRef;
  @ViewChild('photo2')
  photo2:ElementRef;
  @ViewChild('photo3')
  photo3:ElementRef;
  @ViewChild('photo4')
  photo4:ElementRef;
  @ViewChild('photo5')
  photo5:ElementRef;
  showButton:any={
    showButton1:Boolean,
    showButton2:Boolean,
    showButton3:Boolean,
    showButton4:Boolean,
    showButton5:Boolean
  };
  isShowSpinner:any={
    isShowSpinner1:Boolean,
    isShowSpinner2:Boolean,
    isShowSpinner3:Boolean,
    isShowSpinner4:Boolean,
    isShowSpinner5:Boolean,
  }
  //图片数据
  picData:any;
  //图片src
  src : any = {
    src1:String,
    src2:String,
    src3:String,
    src4:String,
    src5:String
  }
  state:string;//实名认证状态

  isAdmin:Boolean;//是否为行政人员
  count;上传接口返回的成功数;
  isOk:any;//是否显示上传页面
  loading2:any;
  title:any;
  reason:string;//失败原因
  isReIdentityToUpdate:boolean = false;//是否重新认证页调到的身份认证页
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appService : AppService,
              public loadingCtrl:LoadingController,
              private camera:Camera,
              public actionSheetCtrl: ActionSheetController,
              private renderer2:Renderer2,
              private el:ElementRef
  ) {
    // 身份验证状态 0 未认证 1 认证中 2 认证成功 3 认证失败
    this.state = this.navParams.get('state').toString();
    // this.state = '3'
    this.title = '实名认证'
    this.isOk = false;
    this.reason = this.navParams.get('msg')
    if(this.state=='1'){
      this.title = '等待审核'
    }else if(this.state=='0'){
      this.isOk = true;
    }

    this.showButton={
      showButton1:true,
      showButton2:true,
      showButton3:true,
      showButton4:true,
      showButton5:true
    };
    this.isShowSpinner={
      isShowSpinner1:true,
      isShowSpinner2:true,
      isShowSpinner3:true,
      isShowSpinner4:true,
      isShowSpinner5:true
    }
    this.username=this.navParams.get('username')
    console.log(this.username)
    this.isAdmin = this.navParams.get('isAdmin')
    console.log(this.isAdmin)
    this.count =0;
    this.picData=[];
  }


  ionViewDidEnter(){

  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{//返回
        if(this.navParams.get('source')=='1'){
           this.navCtrl.push(TabsPage)
        }else if(this.isReIdentityToUpdate){
           this.isReIdentityToUpdate = false
           this.isOk = false;
        }else {
          this.navCtrl.pop()
        }
    }
  }
  //file上传图片
  runFile(photo,front,username,fileType,callback){
    let files = photo.nativeElement.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function(e){
      let data = {
        base64:this.result,
        front:front,
        name:username,
        fileType:fileType
      }
      callback(data)
    }
  }

  //input change
  readFile1(e){
    this.runFile(this.photo1,true,this.username,'IDCARD', data=>{
       this.showButton.showButton1=false
       this.src.src1 = data.base64;
       this.picData.push(data);
    })
  }
  readFile2(e){
    this.runFile(this.photo2,false,this.username,'IDCARD', data=>{
      this.showButton.showButton2=false
      this.src.src2 = data.base64;
      this.picData.push(data);
    })
  }
  readFile3(e){
    this.runFile(this.photo3,true,this.username,'CARD',data=>{
      this.showButton.showButton3=false
      this.src.src3 = data.base64;
      this.picData.push(data);
    })
  }
  readFile4(e){
    this.runFile(this.photo4,true,this.username,'PHYSICIA',data=>{
      this.showButton.showButton4=false
      this.src.src4 = data.base64;
      this.picData.push(data);
    })
  }
  readFile5(e){
    this.runFile(this.photo5,false,this.username,'PHYSICIA',data=>{
      this.showButton.showButton5=false;
      this.src.src5 = data.base64;
      this.picData.push(data);
    })
  }
  load(event,i){
    let a = event.target.parentElement.clientWidth;
    let b = event.target.parentElement.clientHeight;
    // //img dom
    let c = event.target.clientWidth;
    let d = event.target.clientHeight
    // this.renderer2.setStyle(event.target, 'height', d+'px')

    let h = (d * a) / c;
    if( h < b ){
      this.renderer2.setStyle(event.target, 'height', b+'px');
      this.renderer2.setStyle(event.target, 'width', (b*c)/d+'px')
    }else {
      this.renderer2.setStyle(event.target, "width", a+'px')
      this.renderer2.setStyle(event.target, "height", (a * d) / c+'px')
    }

    if(c>a)
      this.renderer2.setStyle(event.target,"left",(a - c) / 2+'px')
    else{
      this.renderer2.setStyle(event.target,"left",0)
    }

    if(d>b){
      this.renderer2.setStyle(event.target,"top",(b-d)/2+'px')
    }
    else{
      this.renderer2.setStyle(event.target,"top",0)
    }

    if(i == 1){
      this.isShowSpinner.isShowSpinner1 = false;
      return false;
    }
    else if(i == 2){
      this.isShowSpinner.isShowSpinner2 = false;
      return false;
    }
    else if(i == 3){
      this.isShowSpinner.isShowSpinner3 = false;
      return false;
    }
    else if(i == 4){
      this.isShowSpinner.isShowSpinner4 = false;
      return false;
    }
    else if(i == 5){
      this.isShowSpinner.isShowSpinner5 = false;
    }
  }


  // 获取字符长度的方法
  getBLen = function(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
  }


   //提交
   submit(){
      if(this.username=="" || this.username == undefined){
        this.appService.presentToast('请填写姓名','middle')
        return false;
      }
      else if(this.getBLen(this.username)>16){
        this.appService.presentToast('请输入8个汉字(16个字符)以内的真实姓名','middle');
        return;
      }
      else if(this.username.match(/^\d+$/g) || this.username.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.username.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.username.match(/^[ ]+$/)){
        this.appService.presentToast('请输入正确格式的名字','middle')
        return;
      }
      else if(this.showButton.showButton1==true){
        this.appService.presentToast('请上传身份证正面照','middle')
        return false;
      }
     else if(this.showButton.showButton2==true){
       this.appService.presentToast('请上传身份证反面照','middle')
       return false;
     }
     if(this.showButton.showButton3==true && this.isAdmin == true){
       this.appService.presentToast('请上传工作证(带照片)或就职(加盖公章)','middle')
       return false;
     }
     else if(this.showButton.showButton4==true && this.isAdmin == false){
       this.appService.presentToast('请上传医师资格证正面照','middle')
       return false;
     }
     else if(this.showButton.showButton5==true && this.isAdmin == false){
       this.appService.presentToast('请上传医师资格证反面照','middle')
       return false;
     }else{
       this.loading2 = this.loadingCtrl.create();
       this.loading2.present();
       this.delay(0)
     }
   }


   //同步上传
  // asyncUpload(params){
  //   let i :number = params;
  //   this.picData[0].name = this.username
  //   this.appService.httpPost('postCertificates','1', this.picData[0], res => {
  //     if(res){
  //        params ++;
  //        if(res.code == 0){
  //          if(params < this.picData.length){
  //            this.asyncUpload(params)
  //          }else {
  //            return;
  //          }
  //        }
  //     }
  //   })
  // }

   //递归
  delay(j){
    setTimeout(()=>{
      this.judge(j)
    },500);
  }


  judge(i){
      if(i<this.picData.length){
        console.log(this.picData[i])
        this.picData[i].name = this.username
        this.appService.httpPost('postCertificates','1',this.picData[i],res=> {
          if(res.code == 0 ){
            this.count++;
          }
        })
        i++;
        this.delay(i);
      }else {
        this.loading2.dismiss();
        if(this.count+1 <this.picData.length){
          this.appService.presentToast('上传失败，请重新上传','middle')
        }else {
          this.state = '1';
          this.isOk = false;
          this.title = '等待审核';
          this.isReIdentityToUpdate = false;
        }
      }
  }

  // concatCallback(i){
  //   console.log(this)
  //   return new Promise((resolve,reject)=>{
  //       console.log(this.picData[i])
  //     if(i<this.picData.length){
  //       this.appService.httpPost('postCertificates','1',this.picData[i],res=> {
  //         if(res.code == 0 ){
  //           this.count++;
  //           resolve(res.data)
  //         }
  //       },true)
  //       i++;
  //     }
  //   })
  // }
  //
  // req(){
  //   this.concatCallback(0).then((result)=>{
  //
  //   })
  // }

  // 重新认证
  reIdentity(){
    let loading = this.loadingCtrl.create();
    if(this.state != '3'){
      loading.present();

      setTimeout(() => {
        loading.dismiss();
        this.src = {
          src1:'',
          src2:'',
          src3:'',
          src4:'',
          src5:''
        }
        this.showButton={
          showButton1:true,
          showButton2:true,
          showButton3:true,
          showButton4:true,
          showButton5:true
        };
        this.picData = [];
        this.isOk = true;
        this.title= '实名认证'
        this.isReIdentityToUpdate = true
      }, 1000);
    }else {
      loading.present();
      this.appService.httpPost('postFailPic','1','',res=>{
        if(res.code == 0){
          console.log(res.data)
          this.isOk = true;
          this.title= '实名认证';
          this.isReIdentityToUpdate = true
          this.showButton={
            showButton1:false,
            showButton2:false,
            showButton3:false,
            showButton4:false,
            showButton5:false
          };
          if(res.data.length>0){
            this.matchArr(res.data);
          }
          loading.dismiss();
        }

      })
    }
  }


  //匹配后台数组
  matchArr(data){
    data.forEach((val, idx, array) => {
      if(val.type == 'IDCARD_F'){
        this.src.src1 = AppGlobal.imgurl  + val.id;
        return;
      }else if(val.type == 'IDCARD_B'){
        this.src.src2 = AppGlobal.imgurl  + val.id;
        return;
      }else if(val.type == 'PHYSICIA_F'){
        this.src.src4 = AppGlobal.imgurl  + val.id;
        return;
      }else if(val.type == 'PHYSICIA_B'){
        this.src.src5 = AppGlobal.imgurl  + val.id;
        return
      }else if(val.type == 'CARD'){
        this.src.src3 = AppGlobal.imgurl  + val.id;
      }
    });
  }


  // 点击选择拍照方式
  alert(front,fileType,params){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          // role: 'destructive',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.CAMERA,front,fileType,params)
          }
        },
        {
          text: '从相册选择',
          handler: () => {
            this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY,front,fileType,params)
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


  /**
   * 打开摄像头
   */
  openCamera(method,front,fileType,params){

    const options: CameraOptions = {
    //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
      //保存的图片格式： JPEG = 0, PNG = 1
      targetWidth: 1080,
      //照片宽度
      targetHeight: 800,
      // //照片高度
      allowEdit: true, //在选择之前允许修改截图
      saveToPhotoAlbum: true ,//保存进手机相册
      quality: 100,                                                  //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,//防止照片旋转
      sourceType: method         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
    }
    this.camera.getPicture(options).then((imageData) => {
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let data = {
        base64: imageData,
        front: front,
        name: this.username,
        fileType: fileType
      }
      // alert(JSON.stringify(data));
      this.picData.push(data);
      if(params == '1'){
        this.showButton.showButton1 = false;
        this.src.src1 = base64Image;
        return false;
      }else if(params == '2'){
        this.showButton.showButton2 = false;
        this.src.src2 = base64Image;
        return false;
      }else if(params == '3'){
        this.showButton.showButton3 = false;
        this.src.src3 = base64Image;
        return false;
      }else if(params == '4'){
        this.showButton.showButton4 = false;
        this.src.src4 = base64Image;
        return false;
      }else if(params == '5'){
        this.showButton.showButton5 = false;
        this.src.src5 = base64Image;
        return false;
      }
    }, (err) => {
      // Handle error
      // this.appService.presentToast('失败'+err,'middle')
    });
  }

// 身份证
  upload1(){
    if(!this.isShowSpinner.isShowSpinner1 || this.showButton.showButton1){
      this.alert(true,'IDCARD','1')
    }
  }
  upload2(){
    if(!this.isShowSpinner.isShowSpinner2 || this.showButton.showButton2){
      this.alert(false,'IDCARD','2')
    }
  }
  //工作证
  upload3(){
      if(!this.isShowSpinner.isShowSpinner3 || this.showButton.showButton3){
        this.alert(true,'CARD','3')
    }
  }
  //医师资格证
  upload4(){
      if(!this.isShowSpinner.isShowSpinner4 || this.showButton.showButton4){
        this.alert(true,'PHYSICIA','4')
    }
  }
  upload5(){
      if(!this.isShowSpinner.isShowSpinner5 || this.showButton.showButton5){
        this.alert(false,'PHYSICIA','5')
    }
  }

}
