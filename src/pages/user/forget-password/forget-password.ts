import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AppService } from '../../../app/app.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})

export class ForgetPasswordPage {

    params = {
        phone: '',
        password: '',
        verificationCode: '',
        rePassword: ''
    }

    disable: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        private appService: AppService){
            this.params.phone = navParams.get('phone');
            this.params.verificationCode = navParams.get('verificationCode');
    }

    ionViewDidLoad(){
        console.log('ionViewDidLoad ForgetPage');
    }
    doReset(){
        let raw = this;
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/;

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

        let obj = {
            phone: this.params.phone,
            verificationCode: this.params.verificationCode,
            newPassword: this.params.rePassword
        }

        this.appService.httpPost('postForgotPassword', '1', obj, function(res){
            if(res.code == 0){
                raw.navCtrl.push(LoginPage);
            }
        });

        this.disable = false;
        setTimeout(() => {
            this.disable = true;
        }, 2000);
    }

}
