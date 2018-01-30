import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Slides, Content } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { BasicPage } from '../../user/basic/basic';
import { SharePage } from '../share/share';

@Component({
    selector: 'page-friend-index',
    templateUrl: 'friend-index.html'
})
export class FriendIndexPage {      // 可能认识 == 二度人脉

    @ViewChild(Slides) slides: Slides;
    @ViewChild(Content) content: Content;
    currentPage: number = 0;    //显示当前页面的ion-content
    userId: any;    //用户ID

    firstTab: Array<string> = [];  //一度人脉 分类
    firstDoctorsCount: number = 0;    // 一度人脉 总数
    firstList: Array<string> = [];  //一度人脉 列表

    dnowTab: Array<string> = [];  //可能认识 分类
    dnowDoctorsCount: number = 0;    // 可能认识 总数
    dnowList: Array<string> = [];  //可能认识 列表

    isRefresh: boolean = true;  //判断刷新一度二度人脉
    styleObject: Object = {};   //页面切换动画
    translate3d: boolean = false;   //是否加载页面切换动画
    isOpenClinic: boolean;     //是否有诊所

    constructor(
        public navCtrl: NavController,
        private appService: AppService,
        public zone: NgZone,
        public navParams: NavParams){
            this.appService.getItem(AppGlobal.cache.userId, rs =>{      //从缓存获取用户ID
                this.userId = rs;
            });

            this.appService.getItem(AppGlobal.cache.isOpenClinic, rs =>{      //从缓存获取是否有诊所
                this.isOpenClinic = rs;
                this.isRefresh = rs;
            });
    }

    ionViewDidLoad(){
        if(this.isOpenClinic){
            this.firstDepartment(); // 一度科室分类
            this.onFirstList();     // 一度人脉列表
            this.dnowDepartment();  //初始化可能认识科室分类
            this.onDnowList();    // 初始化可能认识列表
        }
    }

    scrollHandler(event){
        this.zone.run(() => {   //当前滑动的距离
            if(event.scrollTop > 2){
                this.isRefresh = false;
            }else{
                this.isRefresh = true;
            }
        })
    }

    doRefresh(refresher){   //下拉刷新
        setTimeout(() => {
            if(this.currentPage == 0){
                this.firstDepartment(); // 一度科室分类
                this.onFirstList();     // 一度人脉列表
            }else{
                this.dnowDepartment();  //初始化可能认识科室分类
                this.onDnowList();    // 初始化可能认识列表
            }
            refresher.complete();
        }, 200);
    }

    isTranslate3d(){
        this.translate3d = true;
    }

    ionViewWillEnter(){     // 每次进来加载
        if(this.translate3d){
            let i = -8;
            setInterval(() => {
                i++;
                if(i > 0){
                    clearInterval(0);
                    return false;
                }
                this.styleObject = {
                    "transform": "translate3d("+ i +"0px, 0px, 0px)",
                    "opacity": "1"
                }
                // console.log(i)
            }, 15);
            this.translate3d = false;
        }else{
            this.styleObject = {
                "transform": "translate3d(0px, 0px, 0px)",
                "opacity": "1"
            }
        }
    }

    ionViewWillLeave(){      // 每次离开加载
        let i = 1;
        setInterval(() => {
            i++;
            if(i > 8){
                clearInterval(0);
                return false;
            }
            this.styleObject = {
                "transform": "translate3d(-"+ (i+4) +"0px, 0px, 0px)",
                "opacity": "0.90"
            }
            // console.log(i+4)
        }, 20);
    }

    ngAfterViewInit(){
        this.slides.resistanceRatio = 0;    //禁止第一个和最后一个滑动空白
        this.slides.longSwipesRatio = 0.1;
        this.slides.iOSEdgeSwipeDetection = true;
    }

    goToSlide(index){   //添加active
        this.slides.slideTo(index, 300);
        this.addActive(index);
    }

    slideChanged(){     // 滑动切换
        let currentIndex = this.slides.getActiveIndex();
        this.addActive(currentIndex);
    }

    addActive(index){   // 改变tab 颜色
        this.currentPage = index;
    }

    basicBtn(){ //编辑资料
        this.navCtrl.push(BasicPage, {data:'1'});
    }

    share(){    // 邀请好友
        this.navCtrl.push(SharePage);
    }

    dnowDepartment(){   // 可能认识 科室分类
        this.appService.httpPost('postKnowDepartment','1', {doctorId: this.userId}, rs => {
            if(rs.code == 0){
                this.dnowTab = rs.data;
                let dfc = 0;
                for (let i of rs.data){
                    dfc = dfc + i.departmentFunctionCount;
                }
                this.dnowDoctorsCount = dfc;
            }
        });
    }

    onDnowList(){    // 可能认识 列表
        this.appService.httpPost('postKnowList','1', {id: ''}, rs => {
            if(rs.code == 0){
                this.dnowList = rs.data;
            }
        });
    }

    firstDepartment(){   // 一度人脉 科室分类
        this.appService.httpPost('postFirstDepartment','1', {doctorId: this.userId}, rs => {
            if(rs.code == 0){
                this.firstTab = rs.data;
                let dfc = 0;
                for(let i of rs.data){
                    dfc = dfc + i.departmentFunctionCount;
                }
                this.firstDoctorsCount = dfc;
            }
        });
    }

    onFirstList(){    // 一度人脉 列表
        this.appService.httpPost('postFirstList','1', {id: ''}, rs => {
            if(rs.code == 0){
                this.firstList = rs.data;
            }
        }, true);
    }

}
