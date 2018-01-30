import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { JPushService } from 'ionic2-jpush';

import { TabsPage } from '../../tabs/tabs';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { BasicPage } from '../basic/basic';
import { AppService } from '../../../app/app.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

    params = {
        account: '',
        password: ''
    }

    pushPage: any;

    disable: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        private jPushPlugin: JPushService,
        private appService: AppService){
    }

    ionViewDidEnter(){
        // 判断是否登录
        if(window.localStorage._bsxq_token){
            this.pushPage= TabsPage;
        }
    }

    login(){
        let ph = /^1[3|5|7|8|][0-9]{9}$/;

        if (this.params.account == ""){
            this.appService.presentToast('请输入手机号!','middle');
            return;
        }

        if (!(ph.test(this.params.account))){
            this.appService.presentToast('请输入正确手机号!','middle');
            return;
        }

        if (this.params.password == ""){
            this.appService.presentToast('请输入密码!','middle');
            return;
        }

        this.appService.httpPost('postLogin', '1', this.params, (res)  => {
            if(res.code == 0){
                this.jPushContent(res.data.userId);
                this.appService.setItem('_bsxq_token', res.data.value);
                this.appService.setItem('_bsxq_information', this.params.account);
                this.appService.setItem('_bsxq_userId', res.data.userId);
                this.appService.setItem('_bsxq_openClinic', res.attr.hasClinic);
                this.appService.setItem('_bsxq_isOpened', res.attr.isClinicOpen);
                if(res.attr.isFirstLogin){
                    this.navCtrl.push(BasicPage,{data:'2'});
                }else{
                    this.navCtrl.push(TabsPage);
                }
            }
        });

        this.disable = false;
        setTimeout(() => {
            this.disable = true;
        }, 2000);
    }

    register(){
        this.navCtrl.push(RegisterPage);
    }

    forget(){
        this.navCtrl.push(ForgetPage);
    }

    jPushContent(userId){
        // 注册激光
        this.jPushPlugin.init()
        .then(res => alert(res))
        .catch(err => alert(err));

        // 设置别名

        this.jPushPlugin.setAlias({
            sequence: Date.now(),
            alias: userId
        })
        .then((res:any) => {
            this.appService.alert(`别名设置成功 ${res.alias}`);
        })
        .catch(err => {
            alert(err);
        })

    }
}
