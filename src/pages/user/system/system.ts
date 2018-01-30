import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { FeedbackPage } from '../feedback/feedback';
import { AboutusPage } from '../aboutus/aboutus';

@IonicPage()
@Component({
  selector: 'page-system',
  templateUrl: 'system.html',
})
export class SystemPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SystemPage');
    }

    feedback(){     //用户反馈
        this.navCtrl.push(FeedbackPage);
    }

    aboutus(){     //关于我们
        this.navCtrl.push(AboutusPage);
    }

    logOut(){   //退出登录
        window.localStorage.clear();
        this.navCtrl.push(LoginPage);
    }
}
