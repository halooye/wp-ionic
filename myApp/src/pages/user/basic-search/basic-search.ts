import { Component,ViewChild,ElementRef  } from '@angular/core';
import { App, NavController,NavParams,ModalController,ViewController,AlertController } from 'ionic-angular';
import { AppService } from "../../../app/app.service";

@Component({
  selector: 'page-basic-search',
  templateUrl: 'basic-search.html'
})
export class BasicSearchPage {
  items: any;
  val: any;//输入框的值
  inputData: any; //搜索传的值
  i:number;//上拉次数
  isFocus:boolean;//是否获取到焦点
  flag:boolean;//防止重复点击
  isShowhead:boolean;//是否显示顶部

  @ViewChild('search')
  search: ElementRef;

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
    this.isShowhead = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicClinicPage');
    this.getList()
    console.log(this.search)

  }
  ionViewDidEnter(){

  }

  //获取到焦点事件
  getFocus(){
    this.isShowhead = false
    this.isFocus = true;;
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
    this.isShowhead = true;
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
    this.appService.httpPost('postHospitalList', '1', this.inputData, function(res){
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
          let modal = raw.modalCtrl.create(AddHospitalModal,{dependentColumns:dependentColumns});
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

    this.appService.httpPost('postHospitalList', '1', this.inputData, function(res){
      if(res.code == 0){
        self.items=res.data;
        infiniteScroll.complete();
      }
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.appService.httpPost('postHospitalList', '1', this.inputData, function(res){
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
      this.appService.httpPost('postHospitalList', '1', this.inputData, function(res){
        if(res.code == 0){
          self.items = res.data;
        }
      });
    }
  }

  select(item){
    let data={
      hospital:item.name,
      id:item.id
    }

    console.log(data)
    this.appService.setItem('_bsxq_hospital', data);
    this.navCtrl.pop();
  }
}


@Component({
  templateUrl: 'add-modal.html',
  selector:'add-hospital-modal'
})
export class AddHospitalModal {
  dependentColumns:any;
  hospital: string = '';
  address : string;
  @ViewChild('multi')
  multi:ElementRef;
  flag:boolean;//开关

  constructor(public viewCtrl: ViewController,
              private appService: AppService,
              public navCtrl:NavController,
              public appCtrl:App,
              public params:NavParams) {
    // 二级联动
     this.dependentColumns = this.params.get('dependentColumns')
    this.flag = false
  }


  ionViewLoaded(){

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  confirm() {
    let raw=this;
    if(this.hospital==""){
      this.appService.presentToast('请输入医院名称','middle');
      return;
    }
    else if(this.hospital.toString().length>30||this.hospital.toString().length<2){
      this.appService.presentToast('请输入2-30个字以内的医院名称','middle');
      return;
    }
    else if(this.hospital.match(/^\d+$/g) || this.hospital.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.hospital.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.hospital.match(/^[ ]+$/)) {
      this.appService.presentToast('请输入正确的医院名称', 'middle');
      return;
    }
    else if(this.address == undefined) {
      this.appService.presentToast('请选择医院所在地','middle');
      return;
    }
    else {
      if(this.flag == false){
        this.flag =true;
        let data : any = this.multi;
        let addHospital={
          text:this.hospital,
          province:data._text.split(' ')[0],
          city:data._text.split(' ')[1]
        }
        console.log(addHospital)
        this.appService.httpPost('postAddHospital', '1', addHospital, function(res){
          if(res.code == 0){
            let storageDate= {
              hospital:res.data.name,
              id:res.data.id
            }

            raw.appService.setItem('_bsxq_hospital', storageDate);
            raw.viewCtrl.dismiss(true);
            this.flag = false;
            // raw.navCtrl.getActiveChildNavs()
            // getRootNavById
            // raw.appCtrl.getRootNav().setRoot(BasicPage).navCtrl.push(BasicPage)
            // raw.navCtrl.push(BasicPage)
          }
        });
      }

    }
  }
}
