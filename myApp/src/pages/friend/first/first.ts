import { Component, Input } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { DoctorHomePage } from '../../clinic/doctor-home/doctor-home';

@Component({
    selector: 'page-first',
    templateUrl: 'first.html',
})
export class FirstPage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径

    userId: any;    //用户ID
    @Input() firstTab: Array<string> = [];  //一度人脉 诊所分类
    @Input() firstDoctorsCount:number = 0;    //科室总数
    @Input() firstList: Array<string> = [];  //一度人脉 诊所分类
    arrow: string = 'arrow-down';   // 箭头图标变量
    idDheight: boolean = true; // 显示更多科室
    dfId: string;   //已选一度人脉科室ID

    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private appService: AppService,
        public navParams: NavParams){
            this.appService.getItem(AppGlobal.cache.userId, rs =>{      //从缓存获取用户ID
                this.userId = rs;
            });
    }

    // doRefresh(refresher){   //下拉刷新
    //     setTimeout(() => {
    //         this.firstDepartment();
    //         this.onFirstList();
    //         refresher.complete();
    //     }, 200);
    // }

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

    doctorHome(type, doctor){  // 查看别人主页链接
        if(type == "1"){
            this.appService.httpPost('postApplyPartner','2',{id: doctor.docId, note: ''},res=>{
                if(res.code == 0){
                    this.appService.presentToast('申请加入 '+ doctor.docName +' 的诊所 发送成功', 'middle');
                }
            });
        }else if(type == "2"){
            this.appService.httpPost('postInvitPartner','2',{id: doctor.docId, note:''},res=>{
              if(res.code == 0){
                  this.appService.presentToast('邀请 '+doctor.docName+' 加入我的诊所 发送成功', 'middle');
              }
            });
        }else{
            this.navCtrl.push(DoctorHomePage, {id: doctor.docId});
        }
    }

    viewPartner(id){
        this.dfId = id;
    }

    // firstDepartment(){   // 一度人脉 科室分类
    //     this.appService.httpPost('postFirstDepartment','1', {doctorId: this.userId}, rs => {
    //         if(rs.code == 0){
    //             this.firstTab = rs.data;
    //             let dfc = 0;
    //             for (let i of rs.data){
    //                 dfc = dfc + i.departmentFunctionCount;
    //             }
    //             this.firstDoctorsCount = dfc;
    //         }
    //     });
    // }
    //
    // onFirstList(){    // 一度人脉 列表
    //     this.appService.httpPost('postFirstList','1', {id: ''}, rs => {
    //         if(rs.code == 0){
    //             this.firstList = rs.data;
    //         }
    //     });
    // }

}
