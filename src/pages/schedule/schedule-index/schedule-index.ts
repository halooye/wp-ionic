import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Content, Platform } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../app/app.service';

declare var Swiper;

@Component({
    selector: 'page-schedule-index',
    templateUrl: 'schedule-index.html',
})

export class ScheduleIndexPage {

    userId: any;    //用户ID
    monthSwiper: any;
    weekSwiper: any;

    @ViewChild(Slides) slides: Slides;
    @ViewChild(Content) content: Content;
    imgUrl: string = AppGlobal.imgurl;   //图片url全路径
    calendarWeekhData: Array<any> = [0, 1, 2, 3, 4, 5];  //周状态 滑动翻页
    calendarData: Array<any> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];  //月状态 滑动翻页
    currentChecked: number = 0;     //当前停留日期
    isToDay: boolean = false;   // 回到今日
    arrow: string = 'down';   // 箭头图标变量
    isCalendar: boolean = true;     //是否展开更多
    isCalendarMore: boolean = false;     //是否展开更多
    calendarTitle: Array<any> = [];     //年月
    calendarTitleCurrent: string;       //按月滑动日期标题
    calendarWeekTitleCurrent: string;  // 按周滑动日期标题
    calendarWeekIndex: number;      // 当前周
    calendarIndex: number;      // 当前月

    data = [];      //远程数据
    index: number = 0;   // 当前页面
    list: any;

    constructor(
        private platform: Platform,
        public navCtrl: NavController,
        private appService: AppService,
        public navParams: NavParams){

            this.appService.getItem(AppGlobal.cache.userId, rs =>{      //从缓存获取用户ID
                this.userId = rs;
            });

            this.list = [
              {refDoctorName:'转诊人',refHospital:'上海第二第二第二第二第二人民医院',state:'0',faceimage:null,patientName:'李刚儿子',age:'18',sex:true,time:new Date(),hospital:'上海第一第一第一第一第一第一第一人民医院',address:'徐汇区慧谷创业三楼会议室会议室会议室会议室',id:'1'},
              {refDoctorName:'李刚',refHospital:'上海第二第二第二第二第二人民医院',state:'1',faceimage:null,patientName:'李刚儿子',age:'18',sex:true,time:new Date(),hospital:'上海第一第一第一第一第一第一第一人民医院',address:'徐汇区慧谷创业三楼会议室会议室会议室会议室',id:'2'},
              {refDoctorName:'李刚',refHospital:'上海第二第二第二第二第二人民医院',state:'0',faceimage:null,patientName:'李刚儿子',age:'18',sex:false,time:new Date(),hospital:'上海第一第一第一第一第一第一第一人民医院',address:'徐汇区慧谷创业三楼会议室会议室会议室会议室',id:'3'}
            ]
    }

    ionViewDidLoad(){
        this.dataTime();
        this.calendar();
        this.initMonthSwiper();
        this.calendarWeek(6);
        this.initWeekSwiper();
    }

    closure(){
        console.log("紧急停诊");
    }

    calendar(){     //日历数据输出
        for(let i = 0; i < 13; i++){
            this.calendarData[i] = this.showCalendarData(i-6);
        }
        let calendarTitle: any = [];
        for(let a of this.calendarData){
            calendarTitle.push({
                toDay: a.toDay,
                year: a.year,
                month: a.month
            });
        }
        this.calendarTitle = calendarTitle;
        this.currentChecked = this.calendarTitle[0].toDay;
    }

    calendarWeek(n){
        this.calendarWeekhData = this.calendarData[n].list;
        for(let a of this.calendarWeekhData){
            for(let b of a.content){
                if(this.currentChecked == b.timeId){
                    this.calendarWeekIndex = b.codeId;
                }
            }
        }
        this.calendarWeekTitleCurrent = this.calendarTitle[n].year + ' 年 ' + this.calendarTitle[n].month + ' 月';
    }

    initMonthSwiper(){
        this.monthSwiper = new Swiper('.pageMonthSlides .swiper-container', {      //日历按月滑动切换
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
            initialSlide: 6,
            speed: 300,
            longSwipesRatio: 0.1,
            onSlideChangeStart: (swiper) => {
                let i = swiper.activeIndex;
                this.calendarTitleCurrent = this.calendarTitle[i].year + ' 年 ' + this.calendarTitle[i].month + ' 月';

                if(swiper.activeIndex != 6){
                    this.isToDay = true;
                }else{
                    if(this.currentChecked == this.calendarTitle[i].toDay){
                        this.isToDay = false;
                    }else{
                        this.isToDay = true;
                    }
                }
                this.calendarIndex = swiper.activeIndex;
                console.debug(swiper.activeIndex);
            }
        });
    }

    initWeekSwiper(){
        this.weekSwiper = new Swiper('.pageWeekSwiper .swiper-container', {     //日历按周滑动切换
            initialSlide: this.calendarWeekIndex,
            speed: 300,
            loop: true,
            longSwipesRatio: 0.1,
            onSlideChangeStart: (swiper) => {
                let i = swiper.activeIndex;

                if(swiper.activeIndex != this.calendarWeekIndex){
                    this.isToDay = true;
                }else{
                    if(this.currentChecked == this.calendarTitle[i].toDay){
                        this.isToDay = false;
                    }else{
                        this.isToDay = true;
                    }
                }
                console.debug(swiper.activeIndex);
            }
        });
    }

    getDateStr(date){   //日历转换
        let _year = date.getFullYear();
        let _month = date.getMonth() + 1;
        let _d = date.getDate();
        _month = (_month > 9) ? ("" + _month) : ("0" + _month);
        _d = (_d > 9) ? ("" + _d) : ("0" + _d);
        return _year + _month + _d;
    }

    showCalendarData(time){     //日历时间获取与处理
        let dateObj = (function(){
            let _date = new Date();
            return{
                getDate: function(){
                    return _date;
                },
                setDate: function(date){
                    _date = date;
                }
            };
        })();

        let date = dateObj.getDate();
            dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + time, 1));

        let _year = dateObj.getDate().getFullYear();
        let _month = dateObj.getDate().getMonth() + 1;
        let _dateStr = this.getDateStr(dateObj.getDate());

        let _firstDay = new Date(_year, _month - 1, 1);     // 当前月第一天

        let obj: any = {
            toDay: this.getDateStr(new Date()),
            year: _dateStr.substr(0, 4),
            month: _dateStr.substr(4,2),
            list: [{content: []},{content: []},{content: []},{content: []},{content: []},{content: []}]
        };

        for(let i = 0; i < 42; i++){
            let _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
            let _thisDayStr = this.getDateStr(_thisDay);

            let isMmonth = false;
            let isDay  = false;
            let isOtherMmonth = false;
            let isBusiness = false;
            let isReferral = false;

            if(_thisDayStr == this.getDateStr(new Date())){    // 当前天
                isDay = true;
            }else if(_thisDayStr.substr(0, 6) == this.getDateStr(_firstDay).substr(0, 6)){  //当前月
                isMmonth = true;
            }else{    // 其他月
                isOtherMmonth = true;
            }

            for(let a of this.data){
                if(_thisDayStr == a.id){
                    if(a.business){
                        isBusiness = true;
                    }
                    if(a.referral){
                        isReferral = true;
                    }
                }
            }
            let pushData = (function(n){
                obj.list[n].content.push({
                    timeId: _thisDayStr,
                    day: _thisDay.getDate(),
                    business: isBusiness,     //接诊
                    referral: isReferral,     //转诊
                    currentDay: isDay,
                    currentMonth: isMmonth,
                    otherMonth: isOtherMmonth,
                    codeId: n
                });
            });

            if(i < 7){ pushData(0) };
            if(i > 6 && i < 14){ pushData(1) };
            if(i > 13 && i < 21){ pushData(2) };
            if(i > 20 && i < 28){ pushData(3) };
            if(i > 27 && i < 35){ pushData(4) };
            if(i > 34 && i < 42){ pushData(5) };
        }

        return obj;
    }

    toDayData(timeId, toDay){
        this.currentChecked = timeId;
        if(this.currentChecked == toDay){
            this.isToDay = false;
        }else{
            this.isToDay = true;
        }
    }

    toDayCurrent(toDay){
        this.currentChecked = toDay;
        this.isToDay = false;
        this.initMonthSwiper();
        this.initWeekSwiper();
    }

    toDayCurrentWeek(toDay){
        this.currentChecked = toDay;
        this.isToDay = false;
        this.calendarWeek(6);
        this.initWeekSwiper();
    }

    arrowSwitch(){
        this.content.resize();
        if(this.arrow == 'down'){
            this.arrow = 'up';
            this.isCalendar = false;
            this.isCalendarMore = true;
        }else{
            this.arrow = 'down';
            this.isCalendar = true;
            this.isCalendarMore = false;
            this.calendarWeek(this.calendarIndex);
            this.initWeekSwiper();
        }
    }

    dataTime(){
        this.data = [
            {
                id: 20171224,
                business: true,
                referral: true
            },{
                id: 20171225,
                business: true,
                referral: false
            },{
                id: 20171226,
                business: false,
                referral: true
            }
        ]
    }

    goToSlide(index){   //添加active
        this.slides.slideTo(index, 300);
        this.addActive(index);
    }

    slideChanged(){     // 滑动切换
        let currentIndex = this.slides.getActiveIndex();
        this.addActive(currentIndex);
    }

    addActive(index){   // 改变tab 颜色
        this.index = index;
    }

    ngAfterViewInit(){
        this.slides.resistanceRatio = 0;
    }

    goDetail(){
        console.log("进入详情")
    }
}
