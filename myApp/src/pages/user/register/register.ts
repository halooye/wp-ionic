import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AppService } from '../../../app/app.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  params = {
      phone: '',
      password: '',
      verificationCode: '',
      rePassword: ''
  }
  codeParam = {
      doctor: 1,
      reg: 1,
      phone: ""
  }

  disable: boolean = true;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public toastCtrl: ToastController,
      private appService: AppService){
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ForgetPage');
  }

  // 验证码倒计时
  verifyCode: any = {
      verifyCodeTips: "获取验证码",
      countdown: 60,
      disable: true
  }
  // 倒计时
  settime(){
      if (this.verifyCode.countdown == 1){
          this.verifyCode.countdown = 60;
          this.verifyCode.verifyCodeTips = "获取验证码";
          this.verifyCode.disable = true;
          return;
      }else{
          this.verifyCode.countdown--;
      }

      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      setTimeout(() => {
          this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
          this.settime();
      }, 1000);
  }
  getCode(){
      let raw = this;
      let ph = /^1[3|5|7|8|][0-9]{9}$/;

      if (this.codeParam.phone == '') {
          this.appService.presentToast('请输入手机号!','middle');
          return;
      }

      if (!(ph.test(this.codeParam.phone))){
          this.appService.presentToast('请输入正确手机号!','middle');
          return;
      }

      this.appService.httpPost('postPhoneRegister', '0', {phone: this.codeParam.phone}, function(res){
          if(res.data.registered == 1){
              raw.appService.presentToast('您的手机号已注册!','middle');
              return;
          }else{
              raw.appService.httpPost('postSmsVerification', '2', raw.codeParam, function(res){});
              //发送验证码成功后开始倒计时
              raw.verifyCode.disable = false;
              raw.settime();
          }
      });
  }
  register(){
      let raw = this;
      this.params.phone = this.codeParam.phone;
      let ph = /^1[3|5|7|8|][0-9]{9}$/;
      let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/;

      if (this.params.phone == ""){
          this.appService.presentToast('请输入手机号!','middle');
          return;
      }

      if (!(ph.test(this.codeParam.phone))){
          this.appService.presentToast('请输入正确手机号!','middle');
          return;
      }

      if (this.params.verificationCode == ""){
          this.appService.presentToast('请输入验证码!','middle');
          return;
      }

      if (this.params.password == ""){
          this.appService.presentToast('请输入密码!','middle');
          return;
      }

      if (!(reg.test(this.params.password))){
          this.appService.presentToast('请输入8-16位由数字和字母组合的密码!','middle');
          return;
      }

      if (this.params.rePassword == ""){
          this.appService.presentToast('请再次输入密码!','middle');
          return;
      }

      if (this.params.password != this.params.rePassword) {
          this.appService.presentToast('两次所输密码不一致，请重新输入!','middle');
          return;
      }

      this.appService.httpPost('postRegister', '1', this.params, function(res){
          if(res.code == 0){
              raw.navCtrl.push(LoginPage);
          }else{
          }
      });

      this.disable = false;
      setTimeout(() => {
          this.disable = true;
      }, 2000);
  }


}
