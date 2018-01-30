import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppGlobal {

    //缓存key的配置
    static cache: any = {
        token: '_bsxq_token',       //token验证
        userInformation: '_bsxq_information',    //用户基本信息
        userId: '_bsxq_userId', //用户ID
        hospital: '_bsxq_hospital',   //已选择的医院信息
        clinic: '_bsxq_clinic',  //已选择的诊所信息
        username: '_bsxq_username',//已填的拥护姓名
        department: '_bsxq_department',//已选择的部门
        level: '_bsxq_department',  //已选择的职级
        project: '_bsxq_project',   //项目
        mydepartment: '_bsxq_mydepartment',       //我的科室分类
        mypartnerlist: '_bsxq_partnerlist',       //我的合伙人列表
        chatList:'_bsxq_chatList',   //对话列表
        isOpenClinic: '_bsxq_openClinic',    //是否开通诊所
        isOpened: '_bsxq_isOpened'    //是否开业
    }

    //接口基地址
    // static domain = "http://120.55.168.228:8848"
    // static domain = "http://192.168.1.144:8848"
    static domain = "http://192.168.1.119:8080"
    // static domain = "http://120.55.168.228:8080"

    //图片 URL
    static imgurl = "http://120.55.168.228:8848/api/image?id="

    //接口地址
    static API: any = {

        //注册登录
        postSmsVerification: '/api/send-verification-code',  //短信验证码
        postRegister: '/api/doctor/register',  //注册提交
        postLogin: '/api/doctor/login',  //登录
        postForgotPassword: '/api/doctor/forgot-password',  //重置密码
        postPhoneRegister: '/api/check-doctor-phone-register',  //验证手机是否被注册
        postForgotCode: '/api/doctor/check-phone-code',  //找回密码

        //我的诊所
        postClinic: '/api/doctor/clinic',  //我的诊所
        postClinicNode: '/api/doctor/clinic-note',  //修改诊所理念
        postClinicName: '/api/doctor/clinic-name', //修改诊所名称
        postClinicHome: '/api/doctor/clinic-card',     //查看自己(他人)诊所
        postDoctorHome: '/api/doctor/doctor-card',     //查看自己(他人)主页
        postPatientList: '/api/doctor/dconn-patient',   //诊所患者列表
        postClinicClose:'/api/doctor/clinic-close',     //诊所歇业
        postClinicOpen:'/api/doctor/clinic-open',     //诊所开业
        // postPartner: '/api/doctor/partner',    //诊所合伙人最新信息
        // postJoinClinicList: '/api/doctor/my-add-clinic',    //我加入的诊所列表
        postPartnerDepartment: '/api/doctor/partner-department',     //自己(他人)合伙人科室分类
        postPartnerList: '/api/doctor/partner-department-function',  //自己(他人)合伙人列表
        postNewJoinClinicList: '/api/doctor/my-add-clinic-new',  //我加入的诊所列表

        // 资料采集与修改
        postPutDepartment: '/api/doctor/put-department',  //设置职称
        postPutClinic: '/api/doctor/put-clinic',  //设置诊所信息
        postPutConsultation: '/api/doctor/put-consultation-fee',  //设置诊所信息
        postAddHospital: '/api/doctor/hospital-add',    //新增医院
        postHospitalList: '/api/doctor/hospital',       //获取医院列表
        postClinicList :'/api/doctor/department-function', //获取科室列表
        postAddClinic: '/api/doctor/put-department-function',  //新增科室
        postLevelList: '/api/doctor/department',   //获取医生职级列表
        postArea: '/api/area',  //城市三级联动
        postDoctorIndex:'/api/doctor/doctor-index',  //个人资料初始化
        postMyProject:'/api/doctor/my-illness',  //我的擅长项目
        postProjectList :'/api/doctor/illness',  //搜索项目
        postAddProject: '/api/doctor/illness-add',  //新增项目
        postDelProject:'/api/doctor/my-illness-del',  //删除项目
        postSelectAndAddProject:'/api/doctor/my-illness-add',   //选择并且添加项目
        postFailPic:'/api/doctor/certificates-failed',  //获取审核失败的照片
        // postIdCard: '/api/doctor/certificates-idcard-init',   //身份证照片查询

        // 提交与PUSH
        postPullInformation: '/api/doctor/put-info',    //提交资料并开通诊所
        postFeedback: '/api/doctor/feedback',      //提交用户反馈
        postDoctorIntroduce: '/api/doctor/introduction-save',  // 保存个人简介
        postUserPhoto: '/api/doctor/put-head-image',     // 上传个人头像
        postCoctorBg: '/api/doctor/doctor-bgimg',     // 上传个人主页背景图
        postCertificates: '/api/doctor/certificates-all',    //上传实名认证图片
        postApplyPartner: '/api/doctor/dconn-apply',     //申请加入他的诊所
        postInvitPartner: '/api/doctor/dconn-invit',  //邀请加入我的诊所

        // 我的人脉
        postFirstDepartment: '/api/doctor/dconn-first-departmentFunction',  //一度人脉科室分类
        postFirstList: '/api/doctor/first-contacts',     //一度人脉列表
        postKnowDepartment: '/api/doctor/dconn-town-departmentFunction',    //二度人脉科室分类
        postKnowList: '/api/doctor/dconn-town-probknow',      //二度人脉列表

        //对话
        postChatList:'/api/doctor/unread-msg-list',     //未读消息的聊天列表
        postMsgList:'/api/doctor/msg-list-info',        //聊天记录
        postSendMsg:'/api/doctor/send-msg',             //发送消息
        postDelChatList:'/api/doctor/del-msg-list',           //删除聊天列表
        postConnectList:'/api/doctor/app-inv-record',     //查看申请邀请列表
        postReadConnectList:'/api/doctor/read-app-inv-record',     //读取申请邀请列表
        postAgreeApply:'/api/doctor/dconn-apply-agree',  //同意申请
        postAgreeInvit:'/api/doctor/dconn-invitation-agree'  //同意邀请

    }
}

@Injectable()
export class AppService {

    constructor(
        public http: Http,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController){
    }

    //对参数进行编码
    encode(params){
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)){
                    var value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = false) {
        let loading = this.loadingCtrl.create();
        if(loader){
            loading.present();
        }
        this.http.get(AppGlobal.domain + AppGlobal.API[url] + this.encode(params))
        .toPromise()
        .then(res => {
            let d = res.json();
            if (loader) {
                loading.dismiss();
            }
            if(d.code != 0){    //自定义错误提示
                this.presentToast(d.message, 'middle')
            }
            callback(d == null ? "[]" : d);
        })
        .catch(error => {
            if(loader){
                loading.dismiss();
            }
            this.handleError(error);
        });
    }

    httpPost(url, type, params, callback, loader: boolean = false){
        let loading = this.loadingCtrl.create({
            showBackdrop: false
        });
        if (loader) {
            loading.present();
        }
        let token = '';
        if(window.localStorage._bsxq_token){
            this.getItem('_bsxq_token', d => {
                token = '?token=' + d;
            });
        }
        this.http.post(AppGlobal.domain + AppGlobal.API[url] + token, this.jsonParam(type, params))
            .toPromise()
            .then(res => {
                let d = res.json();
                if(loader){
                    loading.dismiss();
                }
                if(d.code != 0){    //自定义错误提示
                    this.presentToast(d.message, 'middle')
                    return;
                }
                callback(d == null ? "[]" : d);
            }).catch(error => {
                console.log('报错信息日志：' + error)
                // if(loader){
                //     loading.dismiss();
                // }
                this.handleError(error);
            });
    }

    private handleError(error: Response | any) {
        let msg = '';
        if (error.status == 0) {
            msg = '网络异常，请稍后再试！';
            console.error('请检查参数类型是否匹配');
        }
        if (error.status == 400) {
            msg = '请求无效(code：400)';
            console.error('请检查参数类型是否匹配');
        }
        if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (msg != '') {
            let toast = this.toastCtrl.create({
                message: msg,
                position: 'top',
                duration: 3000
            });
            toast.present();
        }
    }

    alert(message, callback?){  // alert 白色提示框
        if (callback){
            let alert = this.alertCtrl.create({
                // title: '提示',
                message: message,
                buttons: [{
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        }else{
            let alert = this.alertCtrl.create({
                // title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    presentToast(message, position, callback?) {     //toast 黑色提示框  middle top bottom
        let toast = this.toastCtrl.create({
            message: message,
            duration: 1200,
            position: position,
            cssClass: 'basic-notice',
            dismissOnPageChange: false
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    setItem(key: string, obj: any) {
        try {
            var json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error('localStorage error:' + e);
        }
    }

    getItem(key: string, callback){
        try {
            var json = window.localStorage[key];
            var obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error('localStorage error:' + e);
        }
    }

    jsonParam(type: string, param: any){
        if(type == '0'){  //自定义类型
            return param;
        }else if(type == '1'){  //类型 1
            return {
                ip : "127.0.0.1",
                time : Date.now(),
                mobileModel : 'xxx',
                mobileScreen : '5.0',
                mobileCode : '127.0.0.1',
                locationLong : 22.2,
                locationLat : 11.1,
                mobileType : 'wx',
                data : param
            }
        }else if(type == '2'){   //类型 2
            return {
                time : Date.now(),
                mobileType : 'wx',
                data : param
            }
        }
    }
}
