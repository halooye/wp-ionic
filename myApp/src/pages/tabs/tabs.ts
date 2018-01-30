import { Component, ViewChild,Input } from '@angular/core';
import { Tabs, NavParams,Events } from 'ionic-angular';

import { ChatIndexPage } from '../chat/chat-index/chat-index';
import { FriendIndexPage } from '../friend/friend-index/friend-index';
import { ScheduleIndexPage } from '../schedule/schedule-index/schedule-index';
import { ClinicIndexPage } from '../clinic/clinic-index/clinic-index';

@Component({
    selector: 'page-tabs',
    template:`
    <ion-tabs #myTabs>
        <ion-tab *ngFor="let tabRoot of tabRoots" [root]="tabRoot.root" tabBadge="{{tabRoot.tabBadge}}" tabBadgeStyle="{{tabRoot.tabBadgeStyle}}" tabTitle="{{tabRoot.tabTitle}}" tabIcon="{{tabRoot.tabIcon}}"></ion-tab>
    </ion-tabs>`
})
export class TabsPage {
    tabRoots: Object[];
    @ViewChild('myTabs') tabRef: Tabs;
    msgCount:any = null;
    tabId:any;  //指定导航 默认第一个

  constructor(
        public navParams: NavParams,
        public events: Events){
        this.tabId = navParams.get('tabId');
        this.events.subscribe('msgCount', (count, time) => {
            this.msgCount = count;
            if(this.msgCount == 0){
                this.msgCount = null
            }
            if(this.msgCount > 99){
                this.msgCount = '99+'
            }
            let a:any = this.tabRoots[0];
            a.tabBadge = this.msgCount;
        });

        this.tabRoots = [
            {
                root: ChatIndexPage,
                tabTitle: '约诊对话',
                tabBadge: this.msgCount,
                tabBadgeStyle: 'danger',
                tabIcon: 'chat'
            },
            {
                root: FriendIndexPage,
                tabTitle: '我的人脉',
                tabIcon: 'friend'
            },
            {
                root: ScheduleIndexPage,
                tabTitle: '约诊日程',
                tabIcon: 'schedule'
            },
            {
                root: ClinicIndexPage,
                tabTitle: '我的诊所',
                tabIcon: 'clinic'
            }
        ];
    }

    ionViewDidLoad(){
      // this.events.subscribe('msgCount', (count, time) => {
      //   this.msgCount = count;
      // });
    }

    ionViewWillEnter(){
        this.tabRef.select(this.tabId);
    }
}
