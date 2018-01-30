import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { AppService } from '../../../app/app.service';

@Component({
    selector: 'page-forget',
    templateUrl: 'forget.html',
})

export class ForgetPage {

    params = {
        phone: '',
        verificationCode: ''
    }
    codeParam = {
        doctor: 1,
        reg: 0,
        phone: ""
    }

    disable: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        private appService: AppService) {
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
    settime() {
        if (this.verifyCode.countdown == 1) {
            this.verifyCode.countdown = 60;
            this.verifyCode.verifyCodeTips = "获取验证码";
            this.verifyCode.disable = true;
            return;
        } else {
            this.verifyCode.countdown--;
        }

        this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
        setTimeout(() => {
            this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
            this.settime();
        }, 1000);
    }
    getCode(){
        let ph = /^1[3|5|7|8|][0-9]{9}$/;

        if (this.codeParam.phone == '') {
            this.appService.presentToast('请输入手机号!','middle');
            return;
        }

        if (!(ph.test(this.codeParam.phone))){
            this.appService.presentToast('请输入正确手机号!','middle');
            return;
        }

        //发送验证码成功后开始倒计时
        this.verifyCode.disable = false;
        this.appService.httpPost('postSmsVerification', '2', this.codeParam, function(res){

        });
        this.settime();
    }
    doReset(){
        let raw = this;
        this.params.phone = this.codeParam.phone;
        let ph = /^1[3|5|7|8|][0-9]{9}$/;

        if (this.params.phone == ""){
            this.appService.presentToast('请输入手机号!','middle');
            return;
        }

        if (!(ph.test(this.codeParam.phone))){
            this.appService.presentToast('请输入正确手机号!','middle');
            return;
        }

        if (this.params.verificationCode == "") {
            this.appService.presentToast('请输入验证码!','middle');
            return;
        }

        this.appService.httpPost('postForgotCode', '1', this.params, function(res){
            if(res.code == 0){
                raw.navCtrl.push(ForgetPasswordPage, {
                    phone: raw.params.phone,
                    verificationCode: raw.params.verificationCode
                });
            }
        });

        this.disable = false;
        setTimeout(() => {this.disable = true}, 2000);
    }
}
