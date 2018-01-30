import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedbackPage} from "../../user/feedback/feedback";
import {CommomProblemPage} from "../commom-problem/commom-problem";

/**
 * Generated class for the BaiqiuyingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-baiqiuying',
  templateUrl: 'baiqiuying.html',
})
export class BaiqiuyingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BaiqiuyingPage');
  }

  feedback(){
    this.navCtrl.push(FeedbackPage)
  }

  goQuestion(){
     this.navCtrl.push(CommomProblemPage)
  }

}
