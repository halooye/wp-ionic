import { Component } from '@angular/core';
import { IonicPage, NavParams,ViewController,Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-basic-calculate-modal',
  templateUrl: 'basic-calculate-modal.html',
})
export class BasicCalculateModalPage {
  character;
  methods:any;//接转诊方式
  startTimes:any;//诊所开了多久
  price:any;//输入的约诊费
  method:string;
  time:string;
  myPercent:any;   //自己收益
  otherPercent:any; //同行收益
  ourPercent:any;  //平台收益
  meGet:any;
  otherGet:any;
  weGet:any;
  totalGet:any;//总收入

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.price = this.params.get('price');
    console.log(this.price)
    this.methods=[
      {content:'自己接诊',tap:true,method:'1'},
      {content:'转诊给同行',tap:false,method:'2'},
      {content:'同行转给我',tap:false,method:'3'}
    ]
    this.startTimes=[
      {content:'小于三个月',tap:false,time:'1'},
      {content:'大于三个月',tap:true,time:'2'}
    ]
    this.method = '1';
    this.time = '2';
  }

  ionViewDidLoad() {
    // this.setRem();
    this.check();

    let rem=window.getComputedStyle(document.documentElement)["fontSize"]
    console.log(rem)
  }
  ionViewWillEnter(){

  }

  //设置REM
  // setRem() {
  //   let docEl = document.documentElement, resizeEvt = 'orientationchange' in window? 'orientationchange' : 'resize';
  //   if (document.addEventListener === undefined) return;
  //   let clientWidth = docEl.clientWidth;
  //   if (clientWidth === undefined) return;
  //   docEl.style.fontSize = 11 * (clientWidth / 375) + 'px';
  //   console.log(docEl.style.fontSize)
  // }

  //选择方式
  selectMethod=function (item) {
    let index = this.methods.indexOf(item)
    this.methods.forEach((val, idx, array) => {
      if(idx!=index){
        val.tap=false
      }
    });
    item.tap = true;
    this.method=item.method;
    this.check();
  }
  //选择时间
  selectTime=function (item) {
    let index = this.methods.indexOf(item)
    this.startTimes.forEach((val, idx, array) => {
      if(idx!=index){
        val.tap=false
      }
    });
    item.tap = true;
    this.time=item.time;
    this.check();
  }
  //判断函数
  check(){
    if(this.time=='2' && this.method=='1'){
      this.myPercent = '80%';
      this.otherPercent = '0%';
      this.ourPercent = '20%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
      return;
    }
    else if(this.time=='2' && this.method=='2'){
       this.myPercent = '30%';
       this.otherPercent = '50%';
       this.ourPercent = '20%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
       return;
    }else if(this.time=='2' && this.method=='3'){
      this.myPercent = '50%';
      this.otherPercent = '30%';
      this.ourPercent = '20%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
      return;
    }else if(this.time=='1' && this.method=='1'){
      this.myPercent = '100%';
      this.otherPercent = '0%';
      this.ourPercent = '0%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
      return;
    }else if(this.time=='1' && this.method=='2'){
      this.myPercent = '40%';
      this.otherPercent = '60%';
      this.ourPercent = '0%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
      return;
    }else{
      this.myPercent = '60%';
      this.otherPercent = '40%';
      this.ourPercent = '0%';
      if(Number(this.price)<=99999){
        this.calculate(this.price);
      }
    }
  }

   //输入的约诊费有变动
  change(){
    if(this.price == ''){
      // this.price = '0'
    }
    this.check()
  }


  //pres
  press(e){
    if(e.keyCode<48 || e.keyCode>57){
      e.preventDefault()
    }
    if(this.price!=undefined){
      //如果大于6位，则截取
      if(this.price.length == 5 && this.price!='99999'&& e.keyCode>=48 && e.keyCode<=57 ){
        this.price='99999'
      }
    }
  }
  //限制只能输整数
  limitNum(){
    if(this.price!=undefined){

      //必须是单个0
      if(this.price.toString().substring(0,1) == "0" && this.price.length>1){
        this.price = 0;
      }
    }
  }

  //保留两位小数
  returnFloat(value){
    value=Math.round(parseFloat(value)*100)/100;
    let xsd:any =value.toString().split(".");
    if(xsd.length==1){
      value=value.toString()+".00";
      return value;
    }
    if(xsd.length>1){
      if(xsd[1].length<2){
        value=value.toString()+"0";
      }
      return value;
    }
  }

  //计算我的收益
  calculateMine(x){
    let a = x*(Number(this.myPercent.substr(0,this.myPercent.length-1))/100)
    this.meGet=this.returnFloat(a)
  }
  //计算同行的收益
  calculateOther(x){
    let b = x*(Number(this.otherPercent.substr(0,this.otherPercent.length-1))/100)
    this.otherGet=this.returnFloat(b)
  }
  //计算平台的收益
  calculateWe(x){
    let c = x*(Number(this.ourPercent.substr(0,this.ourPercent.length-1))/100)
    this.weGet=this.returnFloat(c)
  }
  //计算总的收益
  calculateTotal(x){
    let d = x*(Number(this.myPercent.substr(0,this.myPercent.length-1))/100*3*30)
    this.totalGet=this.returnFloat(d)
  }
  //合并计算方法
  calculate(x){
    this.calculateMine(x);
    this.calculateOther(x);
    this.calculateWe(x);
    this.calculateTotal(x)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
