import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppGlobal, AppService } from '../../../app/app.service';
import { JoinClinicPage } from '../join-clinic/join-clinic';
import { PartnerPage } from '../partner/partner';
import { SettingPage } from '../../user/setting/setting';
import { SystemPage } from '../../user/system/system';
import { PatientPage } from '../patient/patient';
import { BasicPage } from '../../user/basic/basic';
import { ClinicHomePage } from '../clinic-home/clinic-home';
import { DoctorHomePage } from '../doctor-home/doctor-home';
import { InvitePage } from '../invite/invite';
import { BasicIntroducePage } from '../../user/basic-introduce/basic-introduce';
import { BasicIdentityPage } from '../../user/basic-identity/basic-identity';

declare var Swiper;

@IonicPage()
@Component({
    selector: 'page-clinic-index',
    templateUrl: 'clinic-index.html',
})
export class ClinicIndexPage {

    isOpenClinic: boolean;     //是否有诊所
    swiper: any;    // 未开通诊所滑动动画
    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    data: any = [];  // 诊所信息初始化
    dataDoctor: any = [];  // 医生信息初始化
    isSlidesHead: boolean;  //是否显示头部
    idDheight: boolean = true;  // 显示更多科室
    dlist: boolean = true; // 科室是否满足加载更多条件
    department: Array<any> = [];    // 诊所合伙人 诊所分类
    doctors: Array<any> = [];   // 诊所合伙人 诊所列表
    doctorsCount: number = 0;   // 诊所合伙人 统计个数
    arrow: string = 'arrow-down';   // 箭头图标变量
    clinicList: any;    // 我加入的诊所列表最新
    clinicCount: any;   //我加入的诊所 统计个数
    isJoinClinicList: boolean = true;   //处理我加入的诊所是否有数据
    openStatus: boolean;   //处理是否开业歇业
    isVp: boolean = true;  //合伙人少于三个不显示
    isJp: boolean = true;   //我加入的诊所少于三个不显示
    aboutus: string; //诊所理念
    userId: any;    //用户ID

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        // public events: Events,
        public alertCtrl: AlertController,
        private appService: AppService){
            // events.subscribe('content:clinic', content => {  //诊所理念修改成功并提示
            //     this.appService.presentToast('诊所理念修改成功', 'middle');
            // });

            this.appService.getItem(AppGlobal.cache.userId, rs =>{      //从缓存获取用户ID
                this.userId = rs;
            });

            this.appService.getItem(AppGlobal.cache.isOpenClinic, rs =>{      //从缓存获取是否有诊所
                this.isOpenClinic = rs;
                if(!rs){
                    this.isSlidesHead = true;
                }
            });
    }

    doRefresh(refresher){
        if(this.isOpenClinic){
            setTimeout(() => {
                this.initialization();
                this.partner();
                this.joinClinic();
                refresher.complete();
            }, 300);
        }
    }

    ionViewWillEnter(){  // 每次加载
        if(this.isOpenClinic){
            this.initialization();
        }
    }

    ionViewDidLoad(){   // 初次加载
        if(this.isOpenClinic){
            this.partner();
            this.joinClinic();
        }else{
            this.initSwiper();
        }
    }

    initSwiper(){
        this.swiper = new Swiper('.slides .swiper-container', {      //未开通诊所图片切换
            autoplay: 2000,
            speed: 300
        });
    }

    initialization(){   //诊所基本信息初始化
        this.appService.httpPost('postClinic','0', '', rs => {
            if(rs.code == 0){
                this.data = rs.data;
                this.dataDoctor = rs.data.doctor;
                if(rs.data.notes.length < 37){
                    this.aboutus = rs.data.notes;
                }else{
                    this.aboutus = rs.data.notes.substring(0,36)+"...";
                }

                if(rs.data.isOpen){ //是否开业
                    this.openStatus = true;
                }else{
                    this.openStatus = false;
                }
            }
        });
    }

    partner(){  //诊所合伙人初始化
        this.appService.httpPost('postPartnerDepartment','1', {id: this.userId}, rs => {
            if(rs.code == 0){
                this.department = rs.data;

                let dfc = 0;
                for (let department of rs.data){
                    dfc = dfc + department.departmentFunctionCount;
                }
                this.doctorsCount = dfc;

                if(rs.data.length < 6){
                    this.dlist = true;
                }else{
                    this.dlist = false;
                }

                if(rs.data.length < 4){
                    this.isVp = false;
                }

            }
        });

        this.appService.httpPost('postPartnerList','1',{doctorId: this.userId, departmentFunctionId: '', count: 3}, rs => {
           if(rs.code == 0){
               this.doctors = rs.data;
           }
       });

    }

    joinClinic(){    //我加入的诊所初始化
        this.appService.httpPost('postNewJoinClinicList','1', {value: 3}, rs => {
            if(rs.code == 0){
                this.clinicList = rs.data.dcList;
                this.clinicCount = rs.data.dcCount;
                if(this.clinicCount == 0 || !this.clinicCount){
                    this.isJoinClinicList = false;
                }

                if(this.clinicCount < 4){
                    this.isJp = false;
                }
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

    opened(){   //歇业操作
        let prompt = this.alertCtrl.create({
            title: '确认歇业吗？',
            message: '若您一段时间内不方便转诊，可暂时将诊所歇业。<br>诊所歇业后，患者将不能向您发送约诊请求，同行也不能向您转诊。<br>您可以随时将诊所再次开业。',
            buttons: [
                {
                  text: '取消',
                  handler: data => {
                  }
                },
                {
                  text: '确认',
                  handler: data => {
                      this.appService.httpPost('postClinicClose','0','', res => {
                          if(res.code == 0){
                              // this.appService.presentToast('您的诊所已成功歇业...', 'middle');
                              this.appService.setItem('_bsxq_isOpened', false);
                              this.openStatus = false;
                          }
                      });
                  }
                }
            ]
        });
        prompt.present();
    }

    stopOpened(){   //开业操作
        let prompt = this.alertCtrl.create({
            title: '确认开业吗？',
            // message: '确认开业吗？',
            buttons: [
                {
                  text: '取消',
                  handler: data => {
                  }
                },
                {
                  text: '确认',
                  handler: data => {
                      this.appService.httpPost('postClinicOpen','0','', res => {
                          if(res.code == 0){
                              // this.appService.presentToast('您的诊所已开业成功...', 'middle');
                              this.appService.setItem('_bsxq_isOpened', true);
                              this.openStatus = true;
                          }
                      });
                  }
                }
            ]
        });
        prompt.present();
    }

    basicBtn(){ //编辑资料
        this.navCtrl.push(BasicPage, {data:'1'});
    }

    invitePatient(state, name, profession){   //邀请患者
        if(state == 0){    //未认证
            this.verifiedMsg(state, name, profession, '邀请患者需未完成实名认证哦。');
        }else if(state == 1){  //认证中
            let alert = this.alertCtrl.create({
                title: '邀请患者',
                message: '您的实名认证正在审核中，审核通过就可以邀请患者啦，请等待审核。',
                buttons: ["我知道了"]
            });
            alert.present();
        }else if(state == 2){  //认证成功 进入邀请
            this.navCtrl.push(InvitePage);
        }else if(state == 3){   //认证失败
            this.verifiedMsg(state, name, profession, '实名认证通过就可以邀请患者啦。<br>您的实名认证审核未通过，请重新提交认证材料。');
        }
    }

    identity(state, name, profession, msg){     //进入实名认证页面
        let isAadmin = false;
        if(profession == "A05"){
            isAadmin = true;
        }
        this.navCtrl.push(BasicIdentityPage, {username:name, isAdmin:isAadmin, source:'3', state:state, msg:msg});
    }

    appointment(){  //约诊记录
        this.appService.presentToast('约诊记录正在开发中...', 'bottom');
    }

    earnings(){  //诊所收入
        this.appService.presentToast('诊所收入正在开发中...', 'bottom');
    }

    patient(){  //诊所患者
        this.navCtrl.push(PatientPage);
    }

    invitePartner(){  //邀请合伙人
        this.navCtrl.push(InvitePage);
    }

    statistics(){  //数据统计
        this.appService.presentToast('数据统计正在开发中...', 'bottom');
    }

    setting(){  //编辑资料
        this.navCtrl.push(SettingPage);
    }

    system(){   //系统设置
        this.navCtrl.push(SystemPage);
    }

    viewClinic(){   //查看全部诊所
        this.navCtrl.push(JoinClinicPage);
    }

    viewPartner(id){  //查看全部合伙人
        this.navCtrl.push(PartnerPage, {id: id, userId: this.userId});
    }

    editAbout(a){    //编辑查看诊所理念
        this.navCtrl.push(BasicIntroducePage, {type: '1', title: '编辑诊所理念', content: this.data.notes, jsonName: 'postClinicNode'});
    }

    editClinicName(){   //编辑诊所名称
        let prompt = this.alertCtrl.create({
            title: '诊所名称',
            inputs: [
                {
                    name: 'clinicname',
                    placeholder: '请输入诊所名称',
                    value: this.data.name
                }
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                  text: '保存',
                  handler: data => {
                      if(data.clinicname == ""){
                          this.appService.presentToast('请输入诊所名称!','middle');
                          return;
                      };
                      if(data.clinicname.length > 8 || data.clinicname.length < 2){
                          this.appService.presentToast('请输入2-8个字以内的诊所名称!','middle');
                          return;
                      };
                      this.appService.httpPost('postClinicName', '1', {text: data.clinicname}, res => {
                          if(res.code == 0){
                              this.initialization();
                          }
                      });
                  }
                }
            ]
        });
        prompt.present();
    }

    verifiedMsg(state, name, profession, msg){  //是否实名认证提示
        let prompt = this.alertCtrl.create({
            title: '邀请患者',
            message: msg,
            buttons: [
                {
                  text: '稍后再说',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: '立即认证',
                  handler: data => {
                      this.navCtrl.push(BasicIdentityPage, {username:name, isAdmin:profession, source:'3', state:state});
                  }
                }
            ]
        });
        prompt.present();
    }

    clinicHome(id){   // 查看别人诊所链接
        this.navCtrl.push(ClinicHomePage, {id: id});
    }

    doctorHome(id){  // 查看别人主页链接
        this.navCtrl.push(DoctorHomePage, {id: id});
    }

}
