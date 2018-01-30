import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { DoctorHomePage } from '../../clinic/doctor-home/doctor-home';

@Component({
    selector: 'page-know',
    templateUrl: 'know.html'
})
export class KnowPage {
    userId: any;    //用户ID
    @Input() dnowTab: Array<string> = [];  //可能认识 诊所分类
    @Input() dnowDoctorsCount:number = 0;    //科室总数
    @Input() dnowList: Array<string> = [];  //可能认识 诊所分类
    arrow: string = 'arrow-down';   // 箭头图标变量
    idDheight: boolean = true; // 显示更多科室
    dfId: string;   //已选可能认识科室ID

    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private appService: AppService,
        public navParams: NavParams){
            this.appService.getItem(AppGlobal.cache.userId, rs =>{      //从缓存获取用户ID
                this.userId = rs;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad KnowPage');
    }

    departmentMore(){  //显示全部科室事件
        if(this.idDheight){
            this.idDheight = false;
            this.arrow = 'arrow-up';
        }else{
            this.idDheight = true;
            this.arrow = 'arrow-down';
        }
    }

    doctorHome(id){  // 查看别人主页链接
        this.navCtrl.push(DoctorHomePage, {id: id});
    }

    viewPartner(id){
        this.dfId = id;
    }

    operating(id, name){    //邀请申请
        let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: '邀请加入我的诊所',
              handler: () => {
                  this.appService.httpPost('postInvitPartner','2',{id:id, note:''},res=>{
                    if(res.code == 0){
                        this.appService.presentToast('邀请 '+name+' 加入我的诊所 发送成功', 'middle');
                    }
                  });
              }
            },
            {
              text: '申请加入TA的诊所',
              handler: () => {
                  this.appService.httpPost('postApplyPartner','2',{id: id, note: ''},res=>{
                      if(res.code == 0){
                          this.appService.presentToast('申请加入 '+name+' 的诊所 发送成功', 'middle');
                      }
                  });
              }
            },
            {
              text: '取消',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        });
        actionSheet.present();
    }

}
