import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController,AlertController,ToastController } from 'ionic-angular';
import { BasicIdentityPage } from "../basic-identity/basic-identity";
import { BasicCalculateModalPage} from "../basic-calculate-modal/basic-calculate-modal";
import { AppGlobal, AppService} from "../../../app/app.service";
import {TabsPage} from "../../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-basic-payment',
  templateUrl: 'basic-payment.html'
})
export class BasicPaymentPage {
  text:string;
  stateParams:any;
  price:any;
  total:any;
  flag:boolean;//防止重复点击
  level:string;//职称
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private appService: AppService,
              private alertCtrl: AlertController,
              private  toastCtrl:ToastController) {
    this.stateParams=this.navParams.get('data')
    this.stateParams.minPrice=Number(this.stateParams.minPrice);
    this.level = this.stateParams.departmentName
    this.calculateTotal(this.stateParams.minPrice);
    this.flag = false;
  }

  aboutPrice(){
    let alert = this.alertCtrl.create({
      title: '关于约诊费',
      message: '由接诊人亲自设定，患者支付，用于在白色星球平台上约定' +
      '线下看诊时间和地点的费用，约诊成功后，平台将根据一定的比例进行分配。',
      buttons:[
        {
          text: '我知道了',
          role: 'cancel',
          handler: () => {
          }
        }
      ],
      enableBackdropDismiss:false

    });
    alert.present();
  }

  gotoIndentity(){
    this.flag = true
    let raw = this;
    let payment;
    if(this.price==null || this.price==undefined || this.price==''){
      payment = this.stateParams.minPrice
    }
    else {
      payment = this.price
    }

    if(payment>0 && payment<this.stateParams.minPrice){
      let toast = this.toastCtrl.create({
        message: '请输入0元或大于等于'+this.stateParams.minPrice+'元的约诊费',
        duration: 2000,
        position: 'middle',
        cssClass:'basic-notice'
      });
      toast.onDidDismiss(() => {
         this.flag = false;
      });
      toast.present();
    }else if(!(payment.toString().match(/^\d+$/g))){
      let toast = this.toastCtrl.create({
        message: '请输入正确格式的约诊费',
        duration: 2000,
        position: 'middle',
        cssClass:'basic-notice'
      });
      toast.onDidDismiss(() => {
        this.flag = false;
      });
      toast.present();
    }
    else {
      let data = {
        departmentId:this.stateParams.departmentId,
        departmentName:this.stateParams.departmentName,
        departmentFunctionId:this.stateParams.departmentFunctionId,
        hospitalId:this.stateParams.hospitalId,
        realName:this.stateParams.realName,
        departmentFunctionName:this.stateParams.departmentFunctionName,
        hospitalName:this.stateParams.hospitalName,
        treatmentMoney:Number(payment)
      }


      this.appService.httpPost('postPullInformation', '1', data, res => {
        if(res.code == 0) {
            this.appService.setItem(AppGlobal.cache.isOpenClinic, true);
          let alert = raw.alertCtrl.create({
            title: '资料提交成功',
            message: '请您进行资格认证，认证成功就可以转接诊啦',
            buttons: [
              {
                text: '稍后再说',
                // role: 'cancel',
                handler: () => {
                  raw.navCtrl.push(TabsPage);
                }
              },
              {
                text: '立即认证',
                handler: () => {
                  raw.navCtrl.push(BasicIdentityPage,{username:raw.stateParams.realName,isAdmin:raw.stateParams.isAdmin,source:'1',state:'0',msg:''});
                }
              }
            ],
            enableBackdropDismiss:false
          });
          alert.present();
          raw.flag = false;
        }
      });
    }
  }

  openModal() {
    let payment;
    if(this.price==null || this.price==undefined || this.price == ''){
      payment = this.stateParams.minPrice
    }
    else {
      payment = this.price;
    }

    let data ={
      price:payment
    };
    let modal = this.modalCtrl.create(BasicCalculateModalPage, data);
    modal.present({animate: false});
  }

  //保留两位小数
  returnFloat(value){
    value=Math.round(parseFloat(value)*100)/100;
    let xsd:any =value.toString().split(".");
    if(xsd.length==1){
      value=value.toString()+".00";
      return value;
    }
    if(xsd.length>1){
      if(xsd[1].length<2){
        value=value.toString()+"0";
      }
      return value;
    }
  }

  //输入的约诊费有变动
  change(){

    let payment;
    if(this.price==null || this.price==undefined || this.price == ''){
      payment = this.stateParams.minPrice
      if(payment <= 99999){
        this.calculateTotal(payment);
      }
      return;
    }
    else {
      payment = this.price
      if(payment <= 99999){
        this.calculateTotal(payment);
      }
    }
  }


  //pres
  press(e){
    if(e.keyCode<48 || e.keyCode>57){
      e.preventDefault()
    }
    if(this.price!=undefined){
      //如果大于6位，则截取
      if(this.price.length == 5 && this.price!='99999'&& e.keyCode>=48 && e.keyCode<=57 ){
        this.price='99999'
      }
    }
  }

  //限制只能输整数 keyup
  limitNum(){
    if(this.price!=undefined){

      //必须是单个0
      if(this.price.toString().substring(0,1) == "0" && this.price.length>1){
        this.price = 0;
      }


    }
  }

  //计算总收益
  calculateTotal(x){
    let d = Number(x)*0.8*3*30
    this.total=this.returnFloat(d)
  }
  //输入框事件

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicPaymentPage');
  }

}
