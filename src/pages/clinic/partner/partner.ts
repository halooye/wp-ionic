import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';
import { DoctorHomePage } from '../doctor-home/doctor-home';

@IonicPage()
@Component({
  selector: 'page-partner',
  templateUrl: 'partner.html',
})
export class PartnerPage {
    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    doctors:any;//列表
    id:any;
    i:any;//下拉次数
    department:any;//科室
    idDheight: boolean = true; // 显示更多科室
    arrow: string = 'arrow-down';   // 箭头图标变量
    doctorsCount:number = 0;//总数
    dlist: boolean; // 科室是否满足加载更多条件
    userId:string;
    title:string;//标题
    isOpacity :boolean = true;//是否有透明度
    isOwn: boolean;//是否是自己
    msg:any// 合伙人的说明

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public appService: AppService){

          this.id = this.navParams.get('id')
          this.userId = this.navParams.get('userId')
          console.log(this.userId)
          this.i = 0;
          this.doctors=[];
          this.appService.getItem('_bsxq_userId',data=>{
            console.log(data)
            if(this.userId == data){
              this.title='我的合伙人'
              this.isOwn = true
              this.msg = '加入我诊所的合伙人'
            }else {
              this.title='TA的合伙人'
              this.isOwn = false
              this.msg = '加入TA诊所的合伙人'
            }
          })

    }

    ionViewDidLoad(){
      this.appService.httpPost('postPartnerDepartment','1', {id:this.userId}, rs => {
        if(rs.code == 0){
          this.department = rs.data;
          console.log(this.department)
          for (let i of this.department) {
            this.doctorsCount = this.doctorsCount + Number(i.departmentFunctionCount)
          }
          if(this.department.length < 6){
            this.dlist = true;
          }else{
            this.dlist = false;
          }
          this.init(this.id,20,true,data=>{});
        }
      });
    }

    //刷新更多
    doRefresh(refresher) {
        setTimeout(() => {
            this.init(this.id,20,false)
            refresher.complete();
        }, 200);
    }

    //加载更多
    doInfinite(infiniteScroll) {
      this.i++;
      this.init(this.id,20+20*this.i,false,function () {
        infiniteScroll.complete();
      })
    }

    //切换诊所
    viewPartner(id){
      this.id = id;
      this.init(this.id,20,true)
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

    doctorHome(type, doctor){  // 查看别人主页链接 操作区域链接
        if(type == "1"){
            this.appService.httpPost('postApplyPartner','2',{id: doctor.id, note: ''},res=>{
                if(res.code == 0){
                    doctor.isApplied = true;
                }
            });
        }else{
            this.navCtrl.push(DoctorHomePage, {id: doctor.id});
        }
    }

    init(id,count,loader,callback?){
        let data = {
            doctorId: this.userId,
            departmentFunctionId:id,
            count : count
        }
        this.appService.httpPost('postPartnerList','1',data,res=>{
           if(res.code == 0){
             this.doctors = res.data;
             if(callback){
               callback(res.data)
             }
           }
        },loader)
    }
}
