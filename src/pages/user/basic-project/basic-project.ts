import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SettingPage} from "../setting/setting";
import {BasicSearchProjectPage} from "../basic-search-project/basic-search-project";
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the BasicProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-basic-project',
  templateUrl: 'basic-project.html',
})
export class BasicProjectPage {
  illnessList:any;
  isShow:boolean;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appService:AppService) {
        this.isShow = false
  }

  ionViewWillEnter(){
    if(window.localStorage._bsxq_project){
      this.appService.getItem('_bsxq_project',data=>{
        console.log(data)
        this.illnessList=data;
        this.isShow = true;
      })
    }else {
      this.appService.httpPost('postMyProject','0','',res=>{
        console.log(res)
        if(res.code == 0 ){
          this.illnessList = res.data.illness;
          this.isShow = true;
        }
      },true)
    }
  }

  ionViewDidEnter() {

  }

  addProject(){
    if(this.illnessList.length >= 30 ){
      this.appService.presentToast('最多添加30个擅长项目','middle')
    }else {
      this.appService.setItem('_bsxq_project',this.illnessList)
      this.navCtrl.push(BasicSearchProjectPage)
    }
  }
  delProject(item,e){
    this.appService.httpPost('postDelProject','1',{id:item.id},res=>{
      console.log(res)
      if(res.code==0){
        this.illnessList.forEach((val, idx, array) => {
          if(val.id == item.id){
            array.splice(idx, 1);
            console.log(array)
          }
        });
        this.appService.setItem('_bsxq_project',this.illnessList)
      }
    })
  }
}
