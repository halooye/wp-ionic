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
var BasicCalculateModalPage = (function () {
    function BasicCalculateModalPage(platform, params, viewCtrl) {
        this.platform = platform;
        this.params = params;
        this.viewCtrl = viewCtrl;
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
        this.selectMethod = function (item) {
            var index = this.methods.indexOf(item);
            this.methods.forEach(function (val, idx, array) {
                if (idx != index) {
                    val.tap = false;
                }
            });
            item.tap = true;
            this.method = item.method;
            this.check();
        };
        //选择时间
        this.selectTime = function (item) {
            var index = this.methods.indexOf(item);
            this.startTimes.forEach(function (val, idx, array) {
                if (idx != index) {
                    val.tap = false;
                }
            });
            item.tap = true;
            this.time = item.time;
            this.check();
        };
        this.price = this.params.get('price');
        console.log(this.price);
        this.methods = [
            { content: '自己接诊', tap: true, method: '1' },
            { content: '转诊给同行', tap: false, method: '2' },
            { content: '同行转给我', tap: false, method: '3' }
        ];
        this.startTimes = [
            { content: '小于三个月', tap: false, time: '1' },
            { content: '大于三个月', tap: true, time: '2' }
        ];
        this.method = '1';
        this.time = '2';
    }
    BasicCalculateModalPage.prototype.ionViewDidLoad = function () {
        // this.setRem();
        this.check();
        var rem = window.getComputedStyle(document.documentElement)["fontSize"];
        console.log(rem);
    };
    BasicCalculateModalPage.prototype.ionViewWillEnter = function () {
    };
    //判断函数
    BasicCalculateModalPage.prototype.check = function () {
        if (this.time == '2' && this.method == '1') {
            this.myPercent = '80%';
            this.otherPercent = '0%';
            this.ourPercent = '20%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
            return;
        }
        else if (this.time == '2' && this.method == '2') {
            this.myPercent = '30%';
            this.otherPercent = '50%';
            this.ourPercent = '20%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
            return;
        }
        else if (this.time == '2' && this.method == '3') {
            this.myPercent = '50%';
            this.otherPercent = '30%';
            this.ourPercent = '20%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
            return;
        }
        else if (this.time == '1' && this.method == '1') {
            this.myPercent = '100%';
            this.otherPercent = '0%';
            this.ourPercent = '0%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
            return;
        }
        else if (this.time == '1' && this.method == '2') {
            this.myPercent = '40%';
            this.otherPercent = '60%';
            this.ourPercent = '0%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
            return;
        }
        else {
            this.myPercent = '60%';
            this.otherPercent = '40%';
            this.ourPercent = '0%';
            if (Number(this.price) <= 999999) {
                this.calculate(this.price);
            }
        }
    };
    //输入的约诊费有变动
    BasicCalculateModalPage.prototype.change = function () {
        if (this.price == '') {
            this.price = '0';
        }
        this.check();
    };
    //pres
    BasicCalculateModalPage.prototype.press = function (e) {
        if (e.keyCode < 48 || e.keyCode > 57) {
            e.preventDefault();
        }
    };
    //限制只能输整数
    BasicCalculateModalPage.prototype.limitNum = function () {
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
    //保留两位小数
    BasicCalculateModalPage.prototype.returnFloat = function (value) {
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
    //计算我的收益
    BasicCalculateModalPage.prototype.calculateMine = function (x) {
        var a = x * (Number(this.myPercent.substr(0, this.myPercent.length - 1)) / 100);
        this.meGet = this.returnFloat(a);
    };
    //计算同行的收益
    BasicCalculateModalPage.prototype.calculateOther = function (x) {
        var b = x * (Number(this.otherPercent.substr(0, this.otherPercent.length - 1)) / 100);
        this.otherGet = this.returnFloat(b);
    };
    //计算平台的收益
    BasicCalculateModalPage.prototype.calculateWe = function (x) {
        var c = x * (Number(this.ourPercent.substr(0, this.ourPercent.length - 1)) / 100);
        this.weGet = this.returnFloat(c);
    };
    //计算总的收益
    BasicCalculateModalPage.prototype.calculateTotal = function (x) {
        var d = x * (Number(this.myPercent.substr(0, this.myPercent.length - 1)) / 100 * 3 * 30);
        this.totalGet = this.returnFloat(d);
    };
    //合并计算方法
    BasicCalculateModalPage.prototype.calculate = function (x) {
        this.calculateMine(x);
        this.calculateOther(x);
        this.calculateWe(x);
        this.calculateTotal(x);
    };
    BasicCalculateModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return BasicCalculateModalPage;
}());
BasicCalculateModalPage = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-basic-calculate-modal',
        templateUrl: 'basic-calculate-modal.html',
    })
], BasicCalculateModalPage);
exports.BasicCalculateModalPage = BasicCalculateModalPage;
