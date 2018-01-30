import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController,App } from 'ionic-angular';
import { AppService } from "../../../app/app.service";

@IonicPage()
@Component({
  selector: 'page-basic-clinic',
  templateUrl: 'basic-clinic.html',
})
export class BasicClinicPage {
  items: any;
  val: any;//输入框的值
  inputData: any; //搜索传的值
  i:number;//上拉次数
  isFocus:boolean;//是否获取到焦点
  flag:boolean;//防止重复点击

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private appService:AppService
  ) {
    this.items=[];
    this.i=0;
    this.isFocus = false;
    this.val = '';
    this.flag = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicClinicPage');
    this.getList()
  }

  //获取到焦点事件
  getFocus(){
    console.log(this.val)
    this.isFocus = true;
    if( this.val=='' ){
      this.items=[];
    }
  }
  //失去焦点事件
  getBlur(){
    this.isFocus = false;
    if(this.val == ""){
      this.getList()
    }
  }

  //取消搜索事件
  cancelSearch(){
    this.val = "";
    this.isFocus = false;
    this.getList();
  }

  //清除输入框
  clearInput(){
    this.val = ""
  }

  //获取列表
  getList(){
    let raw = this;
    this.inputData={
      text:"",
      count:20
    }
    this.appService.httpPost('postClinicList', '1', this.inputData, function(res){
      if(res.code == 0){
        raw.items = res.data;
      }
    });
  }

  getKeys(item){
    return Object.keys(item);
  }

  //点击新增医院
  openAddModal(){
    this.flag = true;
    let raw = this;
    let data = {
      id:"233232"
    }

    this.appService.httpPost('postArea', '2', data, function(res){
      console.log(res)
      if(res.code == 0){
        let dependentColumns=res.data
        let modal = raw.modalCtrl.create(AddClinicModal,{dependentColumns:dependentColumns});
        modal.onDidDismiss(data => {
          if(data==true){
            raw.navCtrl.pop()
          }
        });
        modal.present({animate: false});
        raw.flag = false;
      }
    });
  }

  doInfinite(infiniteScroll) {
    let self = this;
    this.i++;
    this.inputData.count = 20+20*this.i;

    this.appService.httpPost('postClinicList', '1', this.inputData, function(res) {
      if (res.code == 0) {
        self.items = res.data;
        infiniteScroll.complete();
      }
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.appService.httpPost('postClinicList', '1', this.inputData, function(res){
      if(res.code == 0){
        refresher.complete();
      }
    });
  }

  getItems(e:any){
    let self = this;
    this.inputData = {
      text:this.val,
      count:20
    }
    if(this.val != ""){
      this.appService.httpPost('postClinicList', '1', this.inputData, function(res){
        if(res.code == 0){
          self.items = res.data;
        }
      });
    }
  }

  select(item){
    let data={
      clinic:item.name,
      id:item.id
    }

    console.log(data)
    this.appService.setItem('_bsxq_clinic', data);
    this.navCtrl.pop();
  }
}

@Component({
  templateUrl: 'add-clinic.html',
  selector:'add-clinic-modal'
})
export class AddClinicModal {
  clinic: string = '';
  flag:boolean
  constructor(public viewCtrl: ViewController,
              private appService: AppService,
              public navCtrl:NavController,
              public appCtrl:App) {
        this.flag = false;
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    let raw = this;
    if(this.clinic==""){
      this.appService.presentToast('请输入科室名称','middle');
      return;
    }
    else if(this.clinic.toString().length>30||this.clinic.toString().length<2){
      console.log(this.clinic)
      this.appService.presentToast('请输入2-30个字符以内的科室名称','middle');
      return;
    }
    else if(this.clinic.match(/^\d+$/g) || this.clinic.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.clinic.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.clinic.match(/^[ ]+$/)) {
      this.appService.presentToast('请输入正确的科室名称', 'middle');
      return;
    }
    else {
      if(this.flag == false){
        this.flag = true
        let addClinic={
          text:this.clinic
        }

        this.appService.httpPost('postAddClinic', '1', addClinic, function(res){
          console.log(res)
          if(res.code == 0){
            let storageDate= {
              clinic:res.data.name,
              id:res.data.id
            }
            raw.appService.setItem('_bsxq_clinic', storageDate);
            raw.viewCtrl.dismiss(true);
            raw.flag = false;
            // raw.appCtrl.getRootNav().setRoot(BasicPage).pop()
            // raw.navCtrl.push(BasicPage)
          }
        });
      }

    }
  }
}
