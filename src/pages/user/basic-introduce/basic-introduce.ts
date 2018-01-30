import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Events, AlertController, Navbar } from 'ionic-angular';
import { SettingPage } from "../setting/setting";
import { ClinicIndexPage } from '../../clinic/clinic-index/clinic-index';
import { AppGlobal, AppService } from '../../../app/app.service';

@Component({
    selector: 'page-basic-introduce',
    templateUrl: 'basic-introduce.html',
})

export class BasicIntroducePage {
    @ViewChild(Navbar) navBar: Navbar;

    type: string;       // 诊所理念: 1, 个人简介：2
    title: string;      //页面标题
    content: any;       // 编辑本本内容
    jsonName: any;      //post接口名字
    count : number;     //字数
    placeholder:string;
    disable: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        public events: Events,
        public alertCtrl: AlertController,
        private appService: AppService){
            this.type = navParams.get('type');
            this.title = navParams.get('title');
            this.content = navParams.get('content')
             if(this.content==null){
               this.content =''
             }
            this.jsonName = navParams.get('jsonName');
            this.init();
            this.count = this.content.length

    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{       //返回提示
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
        }
    }

    //change事件
    verification(){
        this.count = this.content.length
        console.log("验证")
    }

    //初始化
    init(){

        if(!this.content && this.type == '1'){
            this.placeholder = '医者之与我，不是煎汤换药，不是开单写书，而是仁心，是慈悲、是强烈的信仰，是面对未来生存渴望。'
        }else if(!this.content && this.type == '2'){
            this.placeholder = '我叫XXX，我是一名XXX科室的医生！对于该领域有独到的见解。在这线上诊所，都是我认识的靠谱医生，致力于方便患者，提供安心及专业的服务。'
        }else {
          this.placeholder = ''
        }
    }

    save(){    //点击事件
        if (this.content == ""){
            this.appService.presentToast('请输入内容!','middle');
            return;
        }else if (this.content.length < 2){
            this.appService.presentToast('请输入2-200个字以内的内容!','middle');
            return;
        }else if(this.content.match(/^\d+$/g) || this.content.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.content.match(/^[ ]+$/)){
            this.appService.presentToast('请输入正确格式的内容!','middle');
            return
        }else if(this.type == '1'){                     //处理诊所理念
            this.json('content:clinic');
            return
        }else{                                  // 处理个人简介
            this.json('content:doctor');
        }
    }

    json(name){ // 提交入库
        this.appService.httpPost(this.jsonName, '1', {text: this.content}, res =>{
            if(res.code == 0){
                this.events.publish(name, this.content);
                this.navCtrl.pop();
            }
        });

        this.disable = false;
        setTimeout(() => {
            this.disable = true;
        }, 2000);
    }

}
