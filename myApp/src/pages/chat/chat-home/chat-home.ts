import { Component,ViewChild,ElementRef,Renderer2,Directive,Input,HostListener,Output, EventEmitter,NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,Content,ModalController,ActionSheetController,AlertController,ViewController,Navbar } from 'ionic-angular';
import { Keyboard} from "@ionic-native/keyboard";
// import { ImagePicker, ImagePickerOptions} from "@ionic-native/image-picker";
import { Camera, CameraOptions} from '@ionic-native/camera';
import {AppService,AppGlobal} from "../../../app/app.service";
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import {DoctorHomePage} from "../../clinic/doctor-home/doctor-home";
import { DatePipe } from '@angular/common';

declare var Swiper:any;

@IonicPage()
@Component({
  selector: 'page-chat-home',
  templateUrl: 'chat-home.html',
  providers: [Keyboard,DatePipe]
})
export class ChatHomePage {

  imgUrl: string = AppGlobal.imgurl;   //图片url全路径

  msgList:any = [];//会话列表
  user:any;
  toUser:any;
  sendMsg:any = '';//要发送的内容
  picList:any = [];//定义图片列表
  indexList:any = [];//定义图片的index列表
  @ViewChild(Content)
  content: Content;
  tel: any;
  senderId:string;//对方ID
  userId:string; //自己Id
  isOpacity:Boolean = true; // 是否一开始有透明度
  loadingText:any = '加载中'; //加载更多提示语
  storageDirectory: string = '';//图片存储路径
  // aaa:any = [1000,1000]
  @ViewChild(Navbar)
  navBar: Navbar;
  isOpen:Boolean;//是否开业
  enabled:Boolean  = true//对方是否歇业 false是歇业
  isFoucs:Boolean  = false;//是否获取到焦点
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public platform: Platform,
              private keyboard: Keyboard,
              public actionSheetCtrl:ActionSheetController,
              // public imagePicker: ImagePicker,
              public camera: Camera,
              private appService:AppService,
              public alertCtrl:AlertController,
              private el:ElementRef,
              private renderer2: Renderer2,
              public http: Http,
              private photoLibrary: PhotoLibrary,
              private transfer: FileTransfer,
              private file: File,
              private storage: Storage,
              private datePipe:DatePipe,
              public zone: NgZone
              ) {
    this.appService.getItem('_bsxq_userId',data=>{
      this.userId = data
    })
    this.appService.getItem('_bsxq_information',data=>{
      this.tel = data
    })
    this.appService.getItem('_bsxq_isOpened',data=>{
      this.isOpen = data
    })

    this.senderId = this.navParams.get('id')
    this.platform.ready().then(() => {
      /*
      * Disable the Ionic Keyboard Plugin scroll for iOS only
      */
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        // this.keyboard.disableScroll(true);
        this.storageDirectory = this.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = this.file.dataDirectory;
      }
      else {
        return false
      }

    });
    // this.msgList=[
    //   {
    //     createTime: 1513249267000,
    //     msgContent: "fdr",
    //     msgImg: null,
    //     msgTitle: "",
    //     msgType: 1,
    //     receiverId: this.senderId,
    //     senderId: this.userId,
    //   }
    // ]
    console.log(this.navParams.data)
    this.toUser = {
      id: this.senderId,
      name: this.navParams.get('senderName'),
      headImg:this.navParams.get('headImg'),
      introInfo:this.navParams.get('introInfo'),
      hospital:this.navParams.get('hospital')
    }
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{//返回
      this.storage.ready().then(() => {
        // Or to get a key/value pair
        this.storage.get('_bsxq_chatList'+this.userId).then(data => {
          let flag = false;//判断是否在数组中
          for (let val of data){
                if(val.senderId == this.senderId){
                  flag = true
                  if(this.msgList.length>0){
                    val.msgType = this.msgList[this.msgList.length-1].msgType
                    if(this.msgList[this.msgList.length-1].msgType == 1){
                      val.content = this.msgList[this.msgList.length-1].msgContent
                    }
                    else if(this.msgList[this.msgList.length-1].msgType == 2){
                      val.content = '[图片]'
                    }else if(this.msgList[this.msgList.length-1].msgType == 3){
                      val.content = '[电话]'
                    }else if(this.msgList[this.msgList.length-1].msgType == 7) {
                      val.content = '[卡片]'
                    }
                    val.sendTime = this.msgList[this.msgList.length-1].createTime
                    val.chatType = 'chat'
                  }
                }
            }
            if(!flag){
               let content :any
               let sendTime :any
               let msgType :any
              if(this.msgList.length>0){
                msgType = this.msgList[this.msgList.length-1].msgType
                if(msgType == 1){
                  content = this.msgList[this.msgList.length-1].msgContent
                }
                else if(msgType == 2){
                  content = '[图片]'
                }else if(msgType == 3){
                  content = '[电话]'
                }else if(msgType == 7) {
                  content = '[卡片]'
                }
                sendTime = this.msgList[this.msgList.length-1].createTime


                data.push({
                  "senderName": this.navParams.get('senderName'),
                  "introInfo":  this.navParams.get('introInfo'),
                  "msgCount":  0,
                  "senderId": this.senderId,
                  "sendTime": sendTime,
                  "content":  content,
                  "headImg": this.navParams.get('headImg'),
                  "type": msgType,
                  "chatType":'chat'
                })
              }

              // else {
              //    msgType = null
              //    content = ''
              //    sendTime = null
              // }
            }
            this.storage.set('_bsxq_chatList'+this.userId,data)
            this.navCtrl.pop()
           // this.navCtrl.push(ChatIndexPage)
        })
      });
    }
  }

  ionViewWillEnter(){
      // this.http.get('http://120.55.168.228:8848/api/resource?id=55f92c8963e2462e8ea1baa38c2734db&&type=base64')
      //   .toPromise()
      //   .then(res => {
      //     if(res.status == 200){
      //       console.log(res)
      //       // this.aaa = 'data:image/jpeg;base64,'+ this.b64Encode(a._body)
      //     }
      //   })

    this.getList(0,20,res=>{
      if(res.code == 0){
        this.enabled = res.data.enabled
        this.msgList = res.data.list;
        this.msgList.reverse();
        if(res.data.list.length>0){
          res.data.list.forEach((val, idx, array) => {
            val.isShowSpinner = false
            if(idx != 0){
              if( val.createTime-array[idx-1].createTime>600000){
                val.showTime = true
              }else{
                val.showTime = false
              }
            }else{
              val.showTime = true
            }

            if(val.msgType == 2){
              val.isShowSpinner = true
              val.msgImg = this.imgUrl + val.msgImg
            }

            val.time = this.defineTime(res.date,val.createTime)

          });
        }
        this.definePic();
      }
    })
  }


  //禁止输入表情
  limitEmotion(){
     this.sendMsg = this.sendMsg.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'')
  }

  //定义时间
  defineTime(nowDate,msgTime){
    // 今天
    let todayEncode = new Date(nowDate);
    todayEncode.setHours(0);
    todayEncode.setMinutes(0);
    todayEncode.setSeconds(0);
    todayEncode.setMilliseconds(0);
    let today = todayEncode.getTime()

    let year = todayEncode.getFullYear()
    let nowYear = new Date(year,1,1,0,0).getTime()

    let showTime :any
    if(msgTime > today){
      showTime = this.datePipe.transform(msgTime, 'HH:mm');
    }else if(Math.floor(nowYear-msgTime)>0){
      showTime = this.datePipe.transform(msgTime, 'yyyy-MM-dd HH:mm');
    }else {
      showTime = this.datePipe.transform(msgTime, 'MM-dd HH:mm');
    }
    return showTime
  }

  ionViewDidEnter(){
    let raw = this
    this.scrollToBottom(function () {
          raw.isOpacity = false
        })
  }

  heightChange(event){
     if(event == true){
       this.scrollToBottom2()
     }
  }
  renderFinish(event){
    // let raw = this
    // if(event == true && this.isLoadingGet == false){
    //   this.scrollToBottom(function () {
    //     raw.isOpacity = false
    //   })
    // }
  }

  //预览图片
  openImg(index){
    let currentIndex:number =0;
    this.indexList.forEach((val, idx, array) => {
      if( val == index){
        currentIndex = idx
      }
    });
    let data = {
      photos: this.picList,
      initialSlide: currentIndex
    }

    let modal = this.modalCtrl.create(PicModal,{data:data});
    modal.present();
  }

  focus(){
    this.scrollToBottom();
    this.isFoucs = true
  }
  scrollHandler(event){
    this.zone.run(()=> {
        if (this.isFoucs) {
          if (this.el.nativeElement.querySelector('#textArea textarea')) {
            this.el.nativeElement.querySelector('#textArea textarea').blur()
            // window.addEventListener('native.keyboardhide', this.keyboardHideHandler);
          }
        }
    })
  }

  blur(){
      this.isFoucs = false
  }
  input(){

  }

  //content定位
  scrollToBottom(callback?) {
    console.log(this.content.getContentDimensions())
    this.content.resize()
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(0);
        if(callback){
          callback();
        }
      }
    }, 400)
  }

  //无延迟的定位
  scrollToBottom2() {
      if (this.content.scrollToBottom) {
        this.content.resize()
        this.content.scrollToBottom(0);
      }
  }

  //定义图片列表和图片index列表
  definePic(){
    this.picList = []
    this.indexList = []
    this.msgList.forEach((val, idx, array) => {
      if( val.msgType == 2){
        this.picList.push({url:val.msgImg});
        this.indexList.push(idx)
      }
    });
  }


  doRefresh(refresher) {
    let length = this.msgList.length
    this.getList(0,length+20,res=>{
      if(res.code == 0){
        this.enabled = res.data.enabled
        if(res.data.length == length){
          this.renderer2.setStyle(this.el.nativeElement.querySelector('ion-refresher ion-spinner'),'display','none')
          this.loadingText = '没有更多消息'
          setTimeout(()=>{
            refresher.complete();
            // this.scrollToBottom()
            setTimeout(()=>{
              this.loadingText = '加载更多消息'
              this.renderer2.setStyle(this.el.nativeElement.querySelector('ion-refresher ion-spinner'),'display','inline-block')
            },300)
          },500)
        }else {
          // for(let i of res.data){
          //   this.msgList.unshift(i)
          // }
          // this.definePic();
          // refresher.complete();
          this.msgList = res.data.list
          this.msgList.reverse();
          if(res.data.list.length>0){
            res.data.list.forEach((val, idx, array) => {
              val.isShowSpinner = false
              if(idx != 0){
                if( val.createTime-array[idx-1].createTime>600000){
                  val.showTime = true
                }else{
                  val.showTime = false
                }
              }else{
                val.showTime = true
              }

              if(val.msgType == 2){
                val.isShowSpinner = true
                val.msgImg = this.imgUrl + val.msgImg
              }
              val.time = this.defineTime(res.date,val.createTime)
            });
          }
          this.definePic();
          refresher.complete();
          // this.scrollToBottom()
        }
      }
    })
  }


  //拨打电话
  call(tel){
    window.open('tel:' + tel);
  }

  sendPic(){
    // 点击选择拍照方式
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '拍照',
            // role: 'destructive',
            handler: () => {
              this.takePhoto()
            }
          },
          {
            text: '从相册选择',
            handler: () => {
              // this.platform.ready().then(() => {
                // if (this.platform.is('android ')) {
                //   this.hasReadPermission()
                // }else {
                //    this.chooseFromAlbum()
                // }
              // });
              this.chooseFromAlbum()
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

    //拍照
  takePhoto() {
    const options: CameraOptions = {
      // 保存的图片格式： JPEG = 0, PNG = 1
      saveToPhotoAlbum: true,  //保存进手机相册
      quality: 100,                                                  //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,//防止照片旋转
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 640,
      //照片宽度
      targetHeight: 480
      // //照片高度
    };

    this.camera.getPicture(options).then((imageData) => {
      // let base64Image = 'data:image/jpeg;base64,' +  imageData;
      this.send(2,imageData)
    }, (err) => {
      this.appService.presentToast('没有拍照的权限','middle')
    });
  }

  //从相册中选择
  chooseFromAlbum() {
    // const options: ImagePickerOptions = {
    //   maximumImagesCount: 9,
    //   outputType:1
    //   // width:1080,
    //   // height:720
    // };
    // this.imagePicker.getPictures(options).then(images => {
    //   // for (let i of images) {
    //   //   i= 'data:image/jpeg;base64,' + i
    //   // }
    //   alert(images.length)
    //   if(images.length > 0 ){
    //     this.sendHttp(0,images);
    //   }else {
    //     alert(1)
    //     this.send(2,images)
    //   }
    // }, err => {
    //   this.appService.presentToast('没有使用相机的权限','middle')
    // });
    const options: CameraOptions = {
      // 保存的图片格式： JPEG = 0, PNG = 1
      quality: 100,                                                  //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,//防止照片旋转
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 640,
      //照片宽度
      targetHeight: 480
      // //照片高度
    };
    this.camera.getPicture(options).then((imageData) => {
      this.send(2,imageData)
    }, (err) => {

    });
  }

  //android6以下判断是否拿到权限
  hasReadPermission() {
    // this.imagePicker.hasReadPermission().then(result=>{
    //   // if this is 'false' you probably want to call 'requestReadPermission' now
    //     if(result == false){
    //       this.requestReadPermission()
    //     }else {
    //       this.chooseFromAlbum()
    //     }
    // }, err => {
    //
    // });
  }

  //请求权限
  requestReadPermission() {
    // no callbacks required as this opens a popup which returns async
    // this.imagePicker.requestReadPermission().then(() => {
    //    this.chooseFromAlbum()
    // });
  }


  //图片调用发送消息接口
  sendHttp(params,list){
    // let i = params
    // let data = {
    //   receiverId:this.senderId,
    //   msgType:2,
    //   msgContent:'',
    //   msgTitle:'',
    //   msgImg:list[i]
    // }
    // this.appService.httpPost('postSendMsg','0', data, res => {
    //   if(res){
    //      params ++;
    //      if(res.code == 0){
    //          let showTime : Boolean = false;
    //          if(res.date-this.msgList[this.msgList.length-1].createTime>600000){
    //            showTime = true
    //          }
    //          this.msgList.push(
    //            {
    //              createTime: res.date,
    //              receiverId: this.senderId,
    //              senderId: this.userId,
    //              msgType:2,
    //              msgContent:'',
    //              msgTitle:'',
    //              msgImg:this.imgUrl+res.data,
    //              showTime:showTime,
    //              isShowSpinner: false
    //            }
    //          );
    //          this.scrollToBottom()
    //      }
    //
    //
    //      if(params < list.length){
    //          this.sendHttp(params,list)
    //      }else {
    //        this.definePic()
    //        return
    //      }
    //   }
    // })
  }

  //发送消息
  sendMessage(){
    if(this.sendMsg && !(this.sendMsg.match(/^[ ]+$/))){
        this.send(1,this.sendMsg)
    }
  }


  //发送电话
  sendTel(){
    let prompt = this.alertCtrl.create({
      title: '发送电话',
      subTitle:'是否发送手机号给对方',
      message: this.tel,
      cssClass:'alert-center',
      buttons: [
        {
          text: '取消',
          role:'cancel'
        },
        {
          text: '确定',
          handler: data => {
            this.send(3,this.tel)
          }
        }
      ]
    });
    prompt.present();
  }


  //加载图片
  load(event,i){
    let a = event.target.parentElement.clientWidth;
    let b = event.target.parentElement.clientHeight;
    // //img dom
    let c = event.target.naturalWidth;
    let d = event.target.naturalHeight;

    this.renderer2.setStyle(event.target,'height','150px')
    this.renderer2.setStyle(event.target,'width',150*c/d+'px')


    this.msgList[i].isShowSpinner = false
  }

  //图片不存在
  hasError(i){
    this.msgList[i].isShowSpinner = false
    this.msgList[i].msgImg = 'assets/imgs/tuliele.png'
    this.definePic()
  }

  // 长按图片
  hold(imgUrl,event){
    if(imgUrl!='assets/imgs/tuliele.png'){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '保存到相册',
            handler: () => {
              this.saveImage(imgUrl);
            }
          },
          {
            text: '取消'
          }
        ]
      });
      actionSheet.present();
    }
  }

//保存图片到本地
//   saveImage(imgUrl){
    // let fileTransfer: FileTransferObject = this.transfer.create();
    // fileTransfer.download(imgUrl, this.storageDirectory + 'bsxq.jpg').then((entry) => {
    //   this.appService.presentToast('保存成功','bottom')
    // }, (error) => {
    //   this.appService.presentToast('保存失败','bottom')
    // }).catch(err => {
    //   this.appService.presentToast('没有使用存储的权限','bottom')
    // });
  // }

  //获取列表
  getList(start,end,callback){
      let data = {
        myId: this.userId,
        otherId: this.senderId,
        start: start,
        end: end
      }
      this.appService.httpPost('postMsgList','0',data,res=>{
        if(res.code == 0){
          this.user = {
            id: this.userId,
            name: res.data.doctor.name,
            headImg: res.data.doctor.faceImage,
            introInfo:res.data.doctor.title
          }
        }
        callback(res)
      })
  }

  //发送函数
  send(type,content){
    let data = {
      receiverId:this.senderId,
      msgType:type,
      msgContent:'',
      msgTitle:'',
      msgImg:''
    }
    if(type == 1 || type == 3){
      data.msgContent = content
    }else if(type == 2){
      data.msgImg = content
    }else if(type == 7){
      data.msgTitle = '约诊单'
    }

    this.appService.httpPost('postSendMsg','0',data,res=>{
      if(res.code == 0){
        let showTime : Boolean = false;
        if(this.msgList.length == 0){
          showTime = true
        }else {
          if(res.date-this.msgList[this.msgList.length-1].createTime>600000){
            showTime = true
          }
        }
        let data2 = {
          time:this.datePipe.transform(res.date, 'HH:mm'),
          createTime: res.date,
          receiverId: this.senderId,
          senderId: this.userId,
          msgType:type,
          msgContent:'',
          msgTitle:'',
          msgImg:'',
          showTime:showTime,
          isShowSpinner:true
        }
        if(type == 1 || type == 3){
          data2.msgContent = content
        }else if(type == 2){
          data2.msgImg = this.imgUrl+res.data
        }else if(type == 7){
          data2.msgTitle = '约诊单'
        }

        this.msgList.push(data2)

        if(type == 1){
          this.sendMsg = '';
          this.renderer2.setStyle(this.el.nativeElement.querySelector('#textArea textarea'),'height','30px')
          // this.renderer2.setStyle(this.el.nativeElement.querySelector('#textArea textarea'),'line-height','30px')
        }
        else if(type == 2){
          this.definePic()
        }
        this.scrollToBottom()
      }
    })
  }


  //发送常用语
  sendTalk() {
    let prompt = this.alertCtrl.create({
      title: '选择常用语',
      inputs: [
        {
          type: 'radio',
          label: '把病人的简历发我看一下',
          value: '把病人的简历发我看一下',
          checked: true
        },
        {
          type: 'radio',
          label: '现在不方便',
          value: '现在不方便',
          checked: false
        },
        {
          type: 'radio',
          label: '不用谢，应该的',
          value: '不用谢，应该的',
          checked: false
        },
      ],
      buttons: [
        {
          text: '取消'
        },
        {
          text: '发送',
          handler: data => {
            this.send(1, data)
          }
        }
      ]
    });
    prompt.present();
  }

  //点击开业
  openClinic(){
    let prompt = this.alertCtrl.create({
      title: '开业',
      message:'当前歇业中，开业后您将可以与他人聊天，同时将接受转接诊申请。',
      buttons: [
        {
          text: '取消',
          role:'cancel'
        },
        {
          text: '确定',
          handler: data => {
            this.appService.httpPost('postClinicOpen','0','', res => {
              if(res.code == 0){
                this.appService.presentToast('您的诊所已开业成功...', 'top');
                this.isOpen = true
                this.appService.setItem('_bsxq_isOpened', true);
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }

  //保存图片到本地
  saveImage(imgUrl){
    let fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(imgUrl, this.storageDirectory + 'bsxq.jpg',true).then((entry) => {
        this.saveToLibrary(entry.toURL())
    }, (error) => {
      this.appService.presentToast('保存到本地失败','bottom')
    }).catch(err => {
      this.appService.presentToast('没有使用存储的权限','bottom')
    });
  }

  saveToLibrary(url){
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.saveImage(url,'白色星球').then(res=>{
        this.appService.presentToast('保存到相册成功','bottom')
      }).catch(err => {
        this.appService.presentToast('保存到相册失败','bottom')
      });
    })
      .catch(err => {
        this.appService.presentToast('没有使用存储权限','middle')
      });
  }
  doctorHome(item){
    if(item.senderId != this.userId){
      this.navCtrl.push(DoctorHomePage,{id:item.senderId})
    }
  }
}

//设置占位图宽高的指令
@Directive({
  selector: "[set-wh]" // Attribute selector
})
export class SetWh {
  @Input('set-wh') data : any;
  constructor(private el:ElementRef) {

  }

  ngOnInit(): void {
    this.setWh()
  }
  setWh() {
    let ta = this.el.nativeElement
    let a = ta.clientWidth
    if(this.data[0]!=0 && this.data[1]!=0){
      if(this.data[0]/this.data[1]> a/150){
        if( this.data[0] > a){
          ta.style.width = '100%'
          ta.style.height = this.data[1]*a/this.data[0] + 'px'
        }else {
          ta.style.width = this.data[0]+'px'
          ta.style.height = this.data[1]+'px'
        }
      }else if(this.data[0]/this.data[1]<=  a/150){
        if( this.data[1] > 150){
          ta.style.width = this.data[0]*150/this.data[1]+'px'
          ta.style.height = '150px'
        }else {
          ta.style.width = this.data[0]+'px'
          ta.style.height = this.data[1]+'px'
        }
      }
    }else {
      ta.style.width = '150px'
      ta.style.height = '150px'
    }
  }
}

@Directive({
  selector: '[set-action]' // Attribute selector
})
export class SetAction {
  _default='none';
  //参数 setter
  @Input('set-action')
  set haoqihensuibianma (actionName:string) {
    this.setAction(actionName);
  };
  constructor(private el:ElementRef) {
    this.setAction(this._default);
  }

  setAction(action:string) {
    this.el.nativeElement.style.touchAction=action;
  }

}

//列表渲染完成的指令
@Directive({
  selector: "[finish-render]" // Attribute selector
})
export class FinishRender {
  @Input('finish-render') last :Boolean;
  @Output('finishEvent') finishEvent:EventEmitter<Boolean> = new EventEmitter<Boolean>();
  constructor(private el:ElementRef) {

  }

  ngOnInit(): void {
    this.finishEvent.emit(this.last);
  }
}

//高度自适应 给父组件传高度变化
@Directive({
  selector: "ion-textarea[autoresize]" // Attribute selector
})
export class AutoresizeDirective {

  @HostListener('input', ['$event.target'])

  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
    this.heightChange.emit(this.flag);
  }

  @Input('autoresize') maxHeight: number;

  @Output('resizeHeight') heightChange:EventEmitter<Boolean> = new EventEmitter<Boolean>();

  flag:Boolean = false
  initHeight:number = 24
  constructor(public element: ElementRef) {

  }

  ngOnInit(): void {
    this.adjust();
    this.heightChange.emit(this.flag);
  }

  adjust(): void {
    let ta = this.element.nativeElement.querySelector("textarea"),
      newHeight;

    if (ta) {
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      if (this.maxHeight) {
        newHeight = Math.min(ta.scrollHeight, this.maxHeight);
      } else {
        newHeight = ta.scrollHeight;
      }
      if(newHeight != this.initHeight){
        this.flag = true
      }
      if(newHeight > 30){
        ta.style.lineHeight = '24px'
      }else {
        ta.style.lineHeight = '30px'
      }
      ta.style.height = newHeight + "px";
      this.initHeight = newHeight
    }
  }
}


@Component({
  templateUrl: 'pic-modal.html',
  selector:'look-pic-modal'
})
export class PicModal {
  dataList:any;
  initialSlide:number;
  storageDirectory:string =''; //图片存储位置
  // @ViewChild(Slides) slides: Slides;
  constructor(public viewCtrl: ViewController,
              private appService: AppService,
              public navParams: NavParams,
              public actionSheetCtrl:ActionSheetController,
              private photoLibrary: PhotoLibrary,
              public platform:Platform,
              private http:Http,
              private transfer: FileTransfer,
              private file: File) {
    this.dataList = this.navParams.get('data')
    this.initialSlide = Number(this.dataList.initialSlide)
    this.dataList.photos.forEach((val, idx, array) => {
          val.isShowSpinner = true
         if(val.url == 'assets/imgs/tuliele.png'){
             val.isShowSpinner = false
         }
    })
  }

    ngAfterViewInit() {
      // this.slides.resistanceRatio = 0
      // this.slides.zoomMax = 2
      this.initSwiper()
    }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  initSwiper() {
    var swiper = new Swiper('#chat-pic-swiper',{
      zoom:true,
      resistanceRatio:0,
      initialSlide :this.initialSlide,
      spaceBetween: -1,
      passiveListeners: false
    });
  }


  load(event,i){
    this.dataList.photos[i].isShowSpinner = false
  }

  // 长按图片
  hold(imgUrl,event){
    if(imgUrl!='assets/imgs/tuliele.png'){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '保存到相册',
            handler: () => {
              this.saveImage(imgUrl);
            }
          },
          {
            text: '取消'
          }
        ]
      });
      actionSheet.present();
    }
  }

  //保存图片到本地
  saveImage(imgUrl){
    let fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(imgUrl, this.storageDirectory + 'bsxq.jpg',true).then((entry) => {
      this.saveToLibrary(entry.toURL())
    }, (error) => {
      this.appService.presentToast('保存到本地失败','bottom')
    }).catch(err => {
      this.appService.presentToast('没有使用存储的权限','bottom')
    });
  }

  saveToLibrary(url){
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.saveImage(url,'白色星球').then(res=>{
        this.appService.presentToast('保存到相册成功','bottom')
      }).catch(err => {
        this.appService.presentToast('保存到相册失败','bottom')
      });
    })
      .catch(err => {
        this.appService.presentToast('没有使用存储权限','middle')
      });
  }

}
