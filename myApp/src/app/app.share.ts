import { LoadingController, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

declare var Wechat;
// declare var QQSDK;

@Injectable()
export class AppShare {

    //标题
    title: string = "标题"
    //描述
    description: string = "描述描述";
    //分享链接
    link: string = "http://m.whiteplanet.com.cn/invite.html?id=10d10afc2b5c4db7b9a52589df4fe738&pic=sSqw4W5n&name=张三&title=主任医师";
    //分享图片
    image: string = "http://www.bakdu.com/share.png";

    constructor(public loadingCtrl: LoadingController, platform: Platform) {
        if (platform.is('ios')) {
            this.link = "https://itunes.apple.com/cn/app/";      //APP store 链接
        }
        else if (platform.is('android')) {
            this.link = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.baisexingqiu.com";
        } else {
            this.link = "http://www.baisexingqiu.com";
        }
    }

    wxShare(scene) {
        // var loading = this.loadingCtrl.create({ showBackdrop: false });
        // loading.present();
        try {
            Wechat.share({
                message: {
                    title: this.title,
                    description: this.description,
                    thumb: this.image,
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "",  // 这是第三方带的测试字段
                    messageAction: "", // <action>dotalist</action>
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: this.link
                    }
                },
                scene: scene == 0 ? Wechat.Scene.SESSION : Wechat.Scene.Timeline  // share to Timeline
            }, function () {
                // alert("分享成功！");
            }, function (reason) {
                // alert("Failed: " + reason);
            });
        } catch (error) {
            console.log(error);
        } finally {
            // loading.dismiss();
        }
    }

    // qqShare(scene) {
    //     var loading = this.loadingCtrl.create({ showBackdrop: false });
    //     loading.present();
    //     try {
    //         var args: any = {};
    //         if (scene == 0) {
    //             args.scene = QQSDK.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
    //         }
    //         else {
    //             args.scene = QQSDK.Scene.QQZone;
    //         }
    //         args.url = this.link;
    //         args.title = this.title;
    //         args.description = this.description;
    //         args.image = this.image;
    //         QQSDK.shareNews(function () {
    //             loading.dismiss();
    //         }, function (failReason) {
    //             loading.dismiss();
    //         }, args);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         loading.dismiss();
    //     }
    // }
}
