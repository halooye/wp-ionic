import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController,App } from 'ionic-angular';
import { AppService } from "../../../app/app.service";

@IonicPage()
@Component({
  selector: 'page-basic-search-project',
  templateUrl: 'basic-search-project.html',
})
export class BasicSearchProjectPage {
  items: any;
  val: any;//输入框的值
  inputData: any; //搜索传的值
  i:number;//上拉次数
  isFocus:boolean;//是否获取到焦点
  flag:boolean;//防止重复点击
  stateParams:any;//nav参数
  isDouble;//是否重复添加
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
    this.stateParams=this.navParams.data;
    this.isDouble = false
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicProjectPage');
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
    this.appService.httpPost('postProjectList', '1', this.inputData, function(res){
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
        let modal = raw.modalCtrl.create(AddProjectModal,{dependentColumns:dependentColumns});
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

    this.appService.httpPost('postProjectList', '1', this.inputData, function(res) {
      if (res.code == 0) {
        self.items = res.data;
        infiniteScroll.complete();
      }
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.appService.httpPost('postProjectList', '1', this.inputData, function(res){
      if(res.code == 0){
        refresher.complete();
      }
    });
  }

  getItems(e:any){
    console.log(1)
    let self = this;
    this.inputData = {
      text:this.val,
      count:20
    }
    if(this.val != ""){
      this.appService.httpPost('postProjectList', '1', this.inputData, function(res){
        if(res.code == 0){
          self.items = res.data;
        }
      });
    }
  }

  select(item){
    if(window.localStorage._bsxq_project){
      this.appService.getItem('_bsxq_project',data=>{
        this.isDouble = false
        data.forEach((val, idx, array) => {
          if(val.id == item.id){
            this.isDouble = true    //设置为重复添加
            this.appService.presentToast('您已添加该项目，请重新选择','middle')
          }
        });
        if(!this.isDouble){
          this.flag = true;
          this.appService.httpPost('postSelectAndAddProject','1',{id:item.id},res=>{
            if(res.code == 0 ){
              data.push({
                name:item.name,
                id:item.id
              })
              this.appService.setItem('_bsxq_project',data);
              this.navCtrl.pop();
              this.flag = false;
            }
          })
        }
      })
    }

  }
}

@Component({
  templateUrl: 'add-project.html',
  selector:'add-project-modal'
})
export class AddProjectModal {
  project:string  = '';
  flag:boolean
  isDouble:boolean;//是否为重复添加
  constructor(public viewCtrl: ViewController,
              private appService: AppService,
              public navCtrl:NavController,
              public appCtrl:App) {
      this.flag =false
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    if(this.project==""){
      this.appService.presentToast('请输入项目名称','middle');
      return;
    }
    else if(this.project.toString().length>13||this.project.toString().length<2){
      console.log(this.project)
      this.appService.presentToast('请输入2-13个字符以内的项目名称','middle');
      return;
    }
    else if(this.project.match(/^\d+$/g) || this.project.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g) || this.project.match(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g) || this.project.match(/^[ ]+$/)) {
      this.appService.presentToast('请输入正确的项目名称', 'middle');
      return;
    }
    else {
      let addProject={
        text:this.project
      }
      if(window.localStorage._bsxq_project){
        this.appService.getItem('_bsxq_project',data=>{
          this.isDouble = false
          data.forEach((val, idx, array) => {
            if(val.name == addProject.text){
              this.isDouble = true    //设置为重复添加
              this.appService.presentToast('您已添加该项目，请重新选择','middle')
            }
          });
          if(!this.isDouble){
            if(this.flag == false){
              this.flag = true;
              this.appService.httpPost('postAddProject','1',addProject,res=>{
                if(res.code == 0 ){
                  data.push({
                    name:addProject.text,
                    id:res.data.id
                  })
                  this.appService.setItem('_bsxq_project',data);
                  this.viewCtrl.dismiss(true);
                  this.flag = false;
                }
              })
            }
          }
        })
      }
    }
  }
}
