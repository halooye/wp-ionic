import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppShare } from '../../../app/app.share';

@IonicPage()
@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html',
})
export class InvitePage {

    constructor(
        public navCtrl: NavController,
        public appShare: AppShare,
        public navParams: NavParams){
    }

    ionViewDidLoad(){
    }

    addShare(a){   // 0: 微信好友, 1: 朋友圈
        this.appShare.wxShare(a);
    }

}
