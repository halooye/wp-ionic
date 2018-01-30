import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ActionSheetController,ToastController,Navbar} from 'ionic-angular';
import { BasicSearchPage } from "../basic-search/basic-search";
import { BasicClinicPage } from "../basic-clinic/basic-clinic";
import { BasicPaymentPage } from "../basic-payment/basic-payment";
import {SettingPage} from "../setting/setting";
import {TabsPage} from "../../tabs/tabs";
import {ChatIndexPage} from "../../chat/chat-index/chat-index";

import { AppService } from "../../../app/app.service";

@IonicPage()
@Component({
  selector: 'page-basic',
  templateUrl: 'basic.html',
})
export class BasicPage {
  @ViewChild(Navbar)
  navBar: Navbar;
  department:any;//部门
  departmentId:string;//部门ID
  username:any;//姓名
  hospital:any;//医院
  hospitalId:string;//医院ID
  clinic:any;//诊所
  clinicId:string;//诊所ID
  level:any;//职称
  levelId:string;//职级ID
  isAdmin:boolean;//是否是行政
  isSelectClinic:boolean;//是否选择部门
  clinicCount:number;
  minPrice:any;//最低价格
  maxPrice:any;//最高价格
  flag:boolean;//防止重复点击

  value:string = 'myid123456789';//全局value

  isFirst:boolean;//认证还是填写资料。认证是true
  title:any;

  @ViewChild('multi')
  multi:ElementRef;
  dependentColumns:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              private appService:AppService,
              public params:NavParams) {
    if(this.navParams.get('data')=='1'){
      this.isFirst= true
      this.title = '基础资料'
    }else if(this.navParams.get('data')=='2') {
      this.isFirst= true
      this.title = '基础资料'
    }else{
      this.isFirst= false
      this.title = '医院与职务'
    }

    this.department = [
      {name:'医师',isBordered:false,id:'A01',logo:'tingzhenqishi'},
      {name:'医技',isBordered:false,id:'A02',logo:'ctjiancha'},
      {name:'药师',isBordered:false,id:'A04',logo:'yaopingline'},
      {name:'护士',isBordered:false,id:'A03',logo:'aixin'},
      {name:'行政',isBordered:false,id:'A05',logo:'hangzhengbangong'}
    ];

    this.flag=false;
    this.defineLevel();
  }
  ionViewDidEnter(){
    console.log(this.multi)
    if(this.multi){
      let data:any = this.multi
      data._text.split(' ')[0] = this.level
    }
  }


  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{       //返回提示
       if(this.navParams.get('data')=='2'){
         this.navCtrl.push(TabsPage)
         return
       }else if(this.navParams.get('data')=='1'){
         this.navCtrl.pop()
         return
       }else {
         this.navCtrl.pop()
       }
    }
  }

  ionViewWillEnter() {
      let raw = this;
      this.clinicCount = null;
    //定义hospital
    this.init('_bsxq_hospital',window.localStorage._bsxq_hospital,function (data) {
      raw.hospital=data.hospital;
      raw.hospitalId = data.id
    },function () {
      raw.hospital='';
      raw.hospitalId=''
    })

    //定义username
    this.init('_bsxq_username',window.localStorage._bsxq_username,function (data) {
      raw.username=data.username;
    },function () {
      raw.username='';
    })


    //定义departmentId
    this.init('_bsxq_department',window.localStorage._bsxq_department,function (data) {
      raw.isSelectClinic = true;
      raw.departmentId=data.id;
      raw.department.forEach((val, idx, array) => {
        if(val.id == raw.departmentId){
          val.isBordered = true;
        }
      });
      if(data.id == 'A05'){
        raw.isAdmin = true;
        raw.clinicCount = 4;
      }else {
        raw.isAdmin = false;
        raw.defineLevel2()
      }
    },function () {
         raw.departmentId = ''
         raw.isAdmin = false
    })

    //定义clinic
    this.init('_bsxq_clinic',window.localStorage._bsxq_clinic,function (data) {
      raw.clinic=data.clinic;
      raw.clinicId = data.id;
      raw.isSelectClinic = true;
    },function () {
      raw.clinic='';
      raw.clinicId=raw.value;
      raw.isSelectClinic = false;
    })

    //定义level
    this.init('_bsxq_level',window.localStorage._bsxq_level,function (data) {
      raw.levelId = data.id ;
      raw.level = data.level;
      raw.minPrice = data.minPrice
      raw.defineLevel1()
    },function () {
      raw.level = '',
        raw.levelId = ''
      raw.minPrice = ''
      raw.defineLevel1()
    })

    console.log(this.dependentColumns)
  }

  // 获取字符长度的方法
  getBLen = function(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
  }

  //初始化  x为是否存在
  init(_bsxq,x,callback,callback2){
    if(x){
      this.appService.getItem(_bsxq, function(data){
        callback(data)
      });
    }else {
      callback2()
    }
  }
  //点击保存
  save() {
    if(this.clinic=="" || this.clinic==undefined){
      this.appService.presentToast('请输入科室名称','middle');
      return;
    }
    else if(this.clinic.toString().length>30||this.clinic.toString().length<2){
      this.appService.presentToast('请输入2-30个字以内的科室名称','middle')
      return;
    }
    else if(this.clinic.match(/^\d+$/g) || this.clinic.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.clinic.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.clinic.match(/^[ ]+$/)){
      this.appService.presentToast('请输入正确格式的科室','middle');
      return;
    }
    else if(this.level=="" || this.level==undefined){
      this.appService.presentToast('请输入职称名称','middle');
      return;
    }
    else if(this.level.toString().length>30||this.level.toString().length<2){
      this.appService.presentToast('请输入2-30个字以内的职称名称','middle');
      return;
    }
    else if(this.level.match(/^\d+$/g) || this.level.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.level.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.level.match(/^[ ]+$/)){
      this.appService.presentToast('请输入正确格式的职称','middle');
      return;
    }
    else if(this.hospital==undefined){
      this.appService.presentToast('请选择所在的医疗机构','middle');
      return;
    }
    else {
      this.flag = true
      let data = {
        departmentFunctionName:this.clinic,
        departmentFunctionId:this.clinicId,
        departmentName:this.level,
        departmentId:this.levelId,
        hospitalName:this.hospital,
        hospitalId:this.hospitalId
      }
      this.appService.httpPost('postPullInformation', '1', data,res=>{
        if(res.code == 0){
          this.putStorage();
          this.navCtrl.pop();
          this.flag = false;
         }
      })
    }
  }

  //点击下一步
  gotoPayment() {
    if(this.username==""){
      this.appService.presentToast('姓名不能为空','middle');
      return;
    }
    else if(this.getBLen(this.username)>16){
      this.appService.presentToast('请输入8个汉字(16个字符)以内的真实姓名','middle');
      return;
    }
    else if(this.username.match(/^\d+$/g) || this.username.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.username.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.username.match(/^[ ]+$/)){
      this.appService.presentToast('请输入正确格式的名字','middle')
      return;
    }
    else if(this.clinic=="" || this.clinic==undefined){
      this.appService.presentToast('请输入科室名称','middle');
      return;
    }
    else if(this.clinic.toString().length>30||this.clinic.toString().length<2){
      this.appService.presentToast('请输入2-30个字以内的科室名称','middle')
      return;
    }
    else if(this.clinic.match(/^\d+$/g) || this.clinic.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.clinic.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.clinic.match(/^[ ]+$/)){
      this.appService.presentToast('请输入正确格式的科室','middle');
      return;
    }
    else if(this.level=="" || this.level==undefined){
      this.appService.presentToast('请输入职称名称','middle');
      return;
    }
    else if(this.level.toString().length>30||this.level.toString().length<2){
      this.appService.presentToast('请输入2-30个字以内的职称名称','middle');
      return;
    }
    else if(this.level.match(/^\d+$/g) || this.level.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.level.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.level.match(/^[ ]+$/)){
      this.appService.presentToast('请输入正确格式的职称','middle');
      return;
    }
    else if(this.hospital==undefined){
      this.appService.presentToast('请选择所在的医疗机构','middle');
      return;
    }
    else {
      let min:any;
      if(this.departmentId=='A05'){
        min = '0'
        this.levelId = ''
      }else {
        min = this.minPrice
      }


      let data = {
        realName:this.username,
        departmentFunctionName:this.clinic,
        departmentFunctionId:this.clinicId,
        departmentName:this.level,
        departmentId:this.levelId,
        hospitalName:this.hospital,
        hospitalId:this.hospitalId,
        minPrice:min,
        isAdmin:this.isAdmin
      }
      this.putStorage();
      this.navCtrl.push(BasicPaymentPage,{data:data});
    }
  }

  //选择部门
  tapEvent(e,item){
    this.isSelectClinic = true;
    this.departmentId = item.id;
    let index = this.department.indexOf(item)
    if(item.isBordered == false){
      item.isBordered = true
    }
      this.department.forEach((val, idx, array) => {
           if(idx!=index){
             val.isBordered=false
           }
      });

    if(index!=this.clinicCount){
      console.log(this.clinicCount)
      this.level="";
      this.levelId = ""
      console.log(this.departmentId)
         if(index ==4){
               this.isAdmin=true;
               this.defineLevel1()
               this.clinic=""
               this.clinicId = this.value
         }else if(index !=4 && this.clinicCount == 4){
               this.clinic=""
               this.clinicId = this.value
               this.isAdmin=false;
               this.defineLevel2();
               setTimeout(() => {
                 console.log(this.multi)
                 if(this.multi){
                   let data:any = this.multi
                   data._text = ''
                 }
               }, 200);
         }else{
               this.isAdmin=false;
               this.defineLevel2();
               setTimeout(() => {
                 console.log(this.multi)
                 if(this.multi){
                   let data:any = this.multi
                   data._text = ''
                 }
               }, 200);
         }
    }
    this.clinicCount=index;
  }

  //存缓存
  putStorage(){
    if(this.username!=''){
      let data = {
        username:this.username
      }
      this.appService.setItem('_bsxq_username',data)
    }

    if(this.level != undefined && this.level != null){
      let data = {
        level:this.level,
        id:this.levelId,
        minPrice:this.minPrice
      }
      this.appService.setItem('_bsxq_level',data)
    }

    if(this.departmentId != ''){
      let data = {
        id:this.departmentId
      }
      this.appService.setItem('_bsxq_department',data)
    }

    if(this.clinic != undefined && this.clinic != null){
      let data= {
        clinic:this.clinic,
        id:this.clinicId
      }
      this.appService.setItem('_bsxq_clinic', data);
    }
  }

  //选择医院
  selectHospital(){
    this.putStorage();
    this.navCtrl.push(BasicSearchPage);
  }

  //选择诊所
  selectClinic(){
    if(this.isSelectClinic == false ){
      this.appService.presentToast('请选择部门','middle');
    }else {
      this.putStorage();
      this.navCtrl.push(BasicClinicPage);
    }
  }

  //定义level
  defineLevel1(){
    this.dependentColumns=[
      {
        options: [
          // { text: '1-1', value: '1',min:'111' },
          {text:this.level,value:this.levelId,min:this.minPrice}
        ]
      }];
  }
  //定义初始化LEVEL 防止报错
  defineLevel(){
    this.dependentColumns=[
      {
        options: [
          {text:'',value:'',min:''}
        ]
      }];
  }

  //点击选择职称
  reqLevel(){
    if(this.isSelectClinic == false ){
          this.appService.presentToast('请选择部门','middle');
        }
  }

//请求接口返回职级列表
  defineLevel2(){
    let departmentData = {
      id:this.departmentId
    }
    console.log(this.departmentId)
    this.appService.httpPost('postLevelList', '1', departmentData, res=>{
      console.log(res)
      if(res.code == 0){
        this.dependentColumns = [];
        this.dependentColumns[0] = res.data;
      }else {
        this.appService.presentToast('获取对应职级列表失败','middle')
      }
    })
  }

  change1(){
    let data:any = this.multi
    this.level = data._text.split(' ')[0]
    console.log(this.level)
    console.log(this.levelId)
    this.dependentColumns[0].options.forEach((val, idx, array) => {
      if(val.value == this.levelId){
        this.minPrice = val.min;
      }
    })
    console.log(this.minPrice)
  }
}
