import { Component,ViewChild } from '@angular/core';
import { Platform,Events,Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { JPushService } from 'ionic2-jpush';

import { LoginPage } from '../pages/user/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { BasicIdentityPage } from "../pages/user/basic-identity/basic-identity";
import { AppService } from "./app.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    rootPage:any = '';
    @ViewChild('myNav') nav: Nav;
    constructor(
        private jPushPlugin: JPushService,
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        public events: Events,
        private appService:AppService){

            // 判断是否登录
            if(window.localStorage._bsxq_token){
                this.rootPage = TabsPage;
            }else{
                this.rootPage = LoginPage;
            }



            //APP 引导页
            platform.ready().then(() => {
                statusBar.styleDefault();
                splashScreen.hide();

                // this.jPushPlugin.init();
                // this.jPushPlugin.setDebugMode(true);

                this.jPushPlugin.openNotification()
                  .subscribe( res => {
                    this.events.publish('click',{});
                })

                this.jPushPlugin.receiveNotification()
                .subscribe(res => {
                    alert('收到通知推送:' + JSON.stringify(res));
                });

                this.jPushPlugin.receiveMessage()
                .subscribe(res => {
                    alert('收到定义消息推送:' + JSON.stringify(res));
                });


                this.events.subscribe('click', (res) => {
                  // this.nav.goToRoot({}).then(() => {//页面返回到根页面,就是app一进来的页面
                  //   let activeVC = this.nav.getActive();
                  //   console.log(activeVC)
                  //   let tabs = activeVC.instance.tabRef;//如果有tab获取tab,没有tab直接push指定页面
                  //   if(tabs) {
                  //     tabs.select(3)
                  //   }
                  //   //证件审核通过
                  //   // if(res.extras.type == 'CERTIFICATES_AUDIT_SUCCESS'){
                  //   //   tabs.select(3)
                  //   // }
                  //   //审核失败
                  //   // else if(res.extras.type == 'CERTIFICATES_AUDIT_SUCCESS'){
                  //   //     this.appService.httpPost('postClinic','0', '', rs => {
                  //   //       if (rs.code == 0) {
                  //   //           let data = rs.data;
                  //   //           let isAdmin = false;
                  //   //           if(data.doctor.departmentCode == "A05"){
                  //   //             isAdmin = true;
                  //   //           }
                  //   //           this.nav.push(BasicIdentityPage,{username:data.doctor.name,isAdmin:isAdmin,source:'1',state:3,msg:data.doctor.identifyRemarks})
                  //   //       }
                  //   //     }
                  //   //   )
                  //   // }
                  //
                  //   // else {
                  //   //   this.nav.push(TabsPage,{tabId:0})
                  //   // }
                  //   // tabs.select(0).then(() => {//其中tab为tab的index
                  //   //   this.nav.push(TabsPage,{tabId:0});//跳转到指定页面
                  //   // })
                  // });
                  this.appService.httpPost('postClinic','0', '', rs => {
                          if (rs.code == 0) {
                              let data = rs.data;
                              let isAdmin = false;
                              if(data.doctor.departmentCode == "A05"){
                                isAdmin = true;
                              }
                              this.nav.push(BasicIdentityPage,{username:data.doctor.name,isAdmin:isAdmin,source:'1',state:3,msg:data.doctor.identifyRemarks})
                          }
                        }
                      )
                });
            });
    }

}
