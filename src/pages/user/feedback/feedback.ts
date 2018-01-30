import { Component, ViewChild,Directive,ElementRef,Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, Navbar,ActionSheetController } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { Camera, CameraOptions} from '@ionic-native/camera';

@IonicPage()
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html',
})
export class FeedbackPage {
    @ViewChild(Navbar) navBar: Navbar;
    content: any = '';       // 编辑本本内容
    // count : number = 0;     //字数
    disable: boolean = true;
    list : any

    constructor(
        public navCtrl: NavController,
        private appService: AppService,
        public events: Events,
        public alertCtrl: AlertController,
        public navParams: NavParams,
        private renderer2:Renderer2,
        public camera: Camera,
        public actionSheetCtrl:ActionSheetController,) {
      this.list=[
        {pic:'assets/imgs/whiteplanet.png',load:false}
      ]
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{       //返回提示

            if(this.content){
                let prompt = this.alertCtrl.create({
                    title: '提示',
                    message: '返回后，将不会保存您的本次编辑。',
                    buttons: [
                        {
                          text: '我再想想',
                          handler: data => {}
                        },
                        {
                          text: '确定',
                          handler: data => {
                              this.navCtrl.pop();
                          }
                        }
                    ]
                });
                prompt.present();
            }else{
                this.navCtrl.pop();
            }

        }
    }

    //change事件
    // verification(){
    //     this.count = this.content.length
    // }

    save(){    //保存
        if (this.content == ""){
            this.appService.presentToast('请输入反馈信息!','middle');
            return;
        }
        if(this.content.length < 2){
            this.appService.presentToast('请输入2-400个字以内反馈信息!','middle');
            return;
        }

        this.appService.httpPost('postFeedback', '1', {text: this.content}, (res)  => {
            if(res.code == 0){
                this.appService.alert('感谢您的反馈！我们会尽快处理您提交的问题与建议。');
                this.content = '';
            }
        });

        this.disable = false;
        setTimeout(() => {
            this.disable = true;
        }, 2000);
    }

  load(event,i){
    let a = event.target.parentElement.clientWidth;
    let b = event.target.parentElement.clientHeight;
    // //img dom
    let c = event.target.naturalWidth;
    let d = event.target.naturalHeight
    // this.renderer2.setStyle(event.target, 'height', d+'px')

    let h = (d * a) / c;
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
    if( h < b ){
      this.renderer2.setStyle(event.target, 'height', b+'px');
      this.renderer2.setStyle(event.target, 'width', (b*c)/d+'px')
    }else {
      this.renderer2.setStyle(event.target, "width", a+'px')
      this.renderer2.setStyle(event.target, "height", (a * d) / c+'px')
    }

    this.list[i].load = true
  }

  getPic(){
    // 点击选择拍照方式
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: '从相册选择',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY)
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

  takePhoto(sourceType) {
    // const options: CameraOptions = {
    //   // 保存的图片格式： JPEG = 0, PNG = 1
    //   saveToPhotoAlbum: true,  //保存进手机相册
    //   quality: 100,                                                  //相片质量 0 -100
    //   destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   correctOrientation:true,//防止照片旋转
    //   sourceType: sourceType,
    //   targetWidth: 1080,
    //   //照片宽度
    //   targetHeight: 720,
    //   // //照片高度
    // };
    //
    // this.camera.getPicture(options).then((imageData) => {
    //   // let base64Image = 'data:image/jpeg;base64,' +  imageData;
    // }, (err) => {
    //
    // });
    this.list.push({pic:'assets/imgs/whiteplanet.png',load:false})
  }

  delete(i){
    this.list.splice(i,1)
  }
}


@Directive({
  selector: '[set-height]' // Attribute selector
})
export class SetHeight {
  constructor(private el:ElementRef) {

  }
  ngOnInit(): void {
    this.el.nativeElement.style.height = this.el.nativeElement.clientWidth + 'px';
  }
}
