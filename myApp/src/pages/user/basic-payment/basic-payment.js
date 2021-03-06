"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var basic_identity_1 = require("../basic-identity/basic-identity");
var basic_calculate_modal_1 = require("../basic-calculate-modal/basic-calculate-modal");
var BasicPaymentPage = (function () {
    function BasicPaymentPage(navCtrl, navParams, modalCtrl, appService, alertCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.appService = appService;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.stateParams = this.navParams.get('data');
        this.stateParams.minPrice = Number(this.stateParams.minPrice);
        this.level = this.stateParams.departmentName;
        this.calculateTotal(this.stateParams.minPrice);
        this.flag = false;
    }
    BasicPaymentPage.prototype.aboutPrice = function () {
        var alert = this.alertCtrl.create({
            title: '关于约诊费',
            message: '由接诊人亲自设定，患者支付，用于在白色星球平台上约定' +
                '线下看诊时间和地点的费用，约诊成功后，平台将根据一定的比例进行分配',
            buttons: [
                {
                    text: '我知道了',
                    role: 'cancel',
                    handler: function () {
                    }
                }
            ],
            enableBackdropDismiss: false
        });
        alert.present();
    };
    BasicPaymentPage.prototype.gotoIndentity = function () {
        var _this = this;
        this.flag = true;
        var raw = this;
        var payment;
        if (this.price == null || this.price == undefined) {
            payment = this.stateParams.minPrice;
        }
        else {
            payment = this.price;
        }
        if (payment > 0 && payment < this.stateParams.minPrice) {
            var toast = this.toastCtrl.create({
                message: '请输入0元或大于等于' + this.stateParams.minPrice + '元的约诊费',
                duration: 2000,
                position: 'middle',
                cssClass: 'basic-notice'
            });
            toast.onDidDismiss(function () {
                _this.flag = false;
            });
            toast.present();
        }
        else {
            var data = {
                departmentId: this.stateParams.departmentId,
                departmentName: this.stateParams.departmentName,
                departmentFunctionId: this.stateParams.departmentFunctionId,
                hospitalId: this.stateParams.hospitalId,
                realName: this.stateParams.realName,
                departmentFunctionName: this.stateParams.departmentFunctionName,
                hospitalName: this.stateParams.hospitalName,
                treatmentMoney: Number(payment),
                sex: true
            };
            this.appService.httpPost('postPullInformation', '1', data, function (res) {
                if (res.code == 0) {
                    var alert_1 = raw.alertCtrl.create({
                        title: '资料提交成功',
                        message: '请您进行资格认证，认证成功就可以转接诊啦',
                        buttons: [
                            {
                                text: '稍后再说',
                                role: 'cancel',
                                handler: function () {
                                }
                            },
                            {
                                text: '立即认证',
                                handler: function () {
                                    raw.navCtrl.push(basic_identity_1.BasicIdentityPage, { username: raw.stateParams.realName });
                                }
                            }
                        ],
                        enableBackdropDismiss: false
                    });
                    alert_1.present();
                    raw.flag = false;
                }
            });
        }
    };
    BasicPaymentPage.prototype.openModal = function () {
        var payment;
        if (this.price == null || this.price == undefined || this.price == '') {
            payment = this.stateParams.minPrice;
        }
        else {
            payment = this.price;
        }
        var data = {
            price: payment
        };
        var modal = this.modalCtrl.create(basic_calculate_modal_1.BasicCalculateModalPage, data);
        modal.present({ animate: false });
    };
    //保留两位小数
    BasicPaymentPage.prototype.returnFloat = function (value) {
        value = Math.round(parseFloat(value) * 100) / 100;
        var xsd = value.toString().split(".");
        if (xsd.length == 1) {
            value = value.toString() + ".00";
            return value;
        }
        if (xsd.length > 1) {
            if (xsd[1].length < 2) {
                value = value.toString() + "0";
            }
            return value;
        }
    };
    //输入的约诊费有变动
    BasicPaymentPage.prototype.change = function () {
        var payment;
        if (this.price == null || this.price == undefined || this.price == '') {
            payment = this.stateParams.minPrice;
            if (payment <= 999999) {
                this.calculateTotal(payment);
            }
            return;
        }
        else {
            payment = this.price;
            if (payment <= 999999) {
                this.calculateTotal(payment);
            }
        }
    };
    //pres
    BasicPaymentPage.prototype.press = function (e) {
        if (e.keyCode < 48 || e.keyCode > 57) {
            e.preventDefault();
        }
    };
    //限制只能输整数
    BasicPaymentPage.prototype.limitNum = function () {
        if (this.price != undefined) {
            //必须是单个0
            if (this.price.toString().substring(0, 1) == "0" && this.price.length > 1) {
                this.price = 0;
            }
            //如果大于6位，则截取
            if (this.price.length == 6 && this.price != '999999') {
                this.price = '999999';
            }
        }
    };
    //计算总收益
    BasicPaymentPage.prototype.calculateTotal = function (x) {
        var d = Number(x) * 0.8 * 3 * 30;
        this.total = this.returnFloat(d);
    };
    //输入框事件
    BasicPaymentPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BasicPaymentPage');
    };
    return BasicPaymentPage;
}());
BasicPaymentPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-basic-payment',
        templateUrl: 'basic-payment.html'
    })
], BasicPaymentPage);
exports.BasicPaymentPage = BasicPaymentPage;
