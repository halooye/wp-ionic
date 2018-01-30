import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { DoctorHomePage } from '../../clinic/doctor-home/doctor-home';


@IonicPage()
@Component({
    selector: 'page-friend-partner',
    templateUrl: 'friend-partner.html',
})
export class FriendPartnerPage {

    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    @Input() userId: any;    //用户ID

    @Input() department: Array<string> = [];     //我的科室分类
    @Input() doctorsCount:number = 0;    //科室总数
    @Input() doctors = [];    //合伙人列表

    arrow: string = 'arrow-down';   // 箭头图标变量
    idDheight: boolean = true; // 显示更多科室
    i:number = 0;  //下拉次数
    @Input() dfId: Array<string> = [];   //已选合伙人科室ID
    @Input() currentPage: number;    //显示当前页面

    constructor(
        public navCtrl: NavController,
        private appService: AppService,
        public navParams: NavParams){
    }

    doRefresh(refresher){   //下拉刷新
        setTimeout(() => {
            this.departments();
            this.partnerList(20, false);
            refresher.complete();
        }, 200);
    }

    doInfinite(infiniteScroll) {    //上拉加载更多
        this.i++;
        this.partnerList(20 + 20 * this.i,false, rs =>{
            this.doctors = rs;
            infiniteScroll.complete();
        });
    }

    departments(){   //我的科室分类
        this.appService.httpPost('postPartnerDepartment','1', {id: this.userId}, rs => {
            if(rs.code == 0){
                this.department = rs.data;
                let dfc = 0;
                for (let i of rs.data){
                    dfc = dfc + i.departmentFunctionCount;
                }
                this.doctorsCount = dfc;
                this.appService.setItem(AppGlobal.cache.mydepartment, rs.data);
            }
        });
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

    partnerList(count, load, callback?){  //根据科室显示合伙人列表
        this.appService.httpPost('postPartnerList', '1', {doctorId: this.userId, departmentFunctionId: this.dfId, count: count}, rs =>{
           if(rs.code == 0){
               this.doctors = rs.data;
               this.appService.setItem(AppGlobal.cache.mypartnerlist, rs.data);
               if(callback){
                    callback(rs.data);
               }
           }
       },load);
    }

    doctorHome(type, doctor){  // 查看别人主页链接 操作区域链接
        if(type == "1"){
            this.appService.httpPost('postApplyPartner','2',{id: doctor.id, note: ''},res=>{
                if(res.code == 0){
                    doctor.isApplied = true;
                    this.partnerList(20, false);
                }
            });
        }else{
            this.navCtrl.push(DoctorHomePage, {id: doctor.id});
        }
    }

    viewPartner(dfId){
        this.dfId = dfId;
        this.partnerList(20, true);
    }

}
