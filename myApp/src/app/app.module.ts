import { HttpModule } from '@angular/http';
import { IonJPushModule } from 'ionic2-jpush';

import { AppService } from './app.service';
import { AppShare } from './app.share';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IndexListModule } from "ionic3-index-list";
import { MultiPickerModule } from 'ion-multi-picker';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Keyboard} from "@ionic-native/keyboard";
// import { ImagePicker } from "@ionic-native/image-picker";
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { QRCodeModule } from 'angular2-qrcode';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/user/login/login';
import { RegisterPage } from '../pages/user/register/register';
import { SettingPage } from '../pages/user/setting/setting';
import { ForgetPage } from '../pages/user/forget/forget';
import { ForgetPasswordPage } from '../pages/user/forget-password/forget-password';
import { BasicPage } from '../pages/user/basic/basic';
import { BasicSearchPage } from '../pages/user/basic-search/basic-search';
import { AddHospitalModal } from "../pages/user/basic-search/basic-search";
import { AddClinicModal} from "../pages/user/basic-clinic/basic-clinic";
import { BasicClinicPage } from '../pages/user/basic-clinic/basic-clinic';
import { BasicPaymentPage } from '../pages/user/basic-payment/basic-payment';
import { BasicCalculateModalPage } from '../pages/user/basic-calculate-modal/basic-calculate-modal';
import { BasicIdentityPage } from '../pages/user/basic-identity/basic-identity';
import { BasicIntroducePage} from "../pages/user/basic-introduce/basic-introduce";
import { BasicProjectPage} from "../pages/user/basic-project/basic-project";
import { BasicSearchProjectPage} from "../pages/user/basic-search-project/basic-search-project";
import {AddProjectModal} from "../pages/user/basic-search-project/basic-search-project";
import { ChatIndexPage } from '../pages/chat/chat-index/chat-index';
import { FriendIndexPage } from '../pages/friend/friend-index/friend-index';
import { ScheduleIndexPage } from '../pages/schedule/schedule-index/schedule-index';
import { ClinicIndexPage } from '../pages/clinic/clinic-index/clinic-index';
import { JoinClinicPage } from '../pages/clinic/join-clinic/join-clinic';
import { PartnerPage } from '../pages/clinic/partner/partner';
import { PatientPage } from '../pages/clinic/patient/patient';
import { ClinicHomePage } from '../pages/clinic/clinic-home/clinic-home';
import { DoctorHomePage } from '../pages/clinic/doctor-home/doctor-home';
import { SystemPage } from '../pages/user/system/system';
import { FeedbackPage,SetHeight } from '../pages/user/feedback/feedback';
import { AboutusPage } from '../pages/user/aboutus/aboutus';
import { ConnectPage } from '../pages/chat/connect/connect';
// import { FriendPartnerPage } from '../pages/friend/friend-partner/friend-partner';
import { KnowPage } from '../pages/friend/know/know';
import { FirstPage } from '../pages/friend/first/first';
// import { JoinPage } from '../pages/friend/join/join';
import { ChatHomePage, AutoresizeDirective, PicModal, SetAction, FinishRender } from "../pages/chat/chat-home/chat-home";
import { SharePage } from '../pages/friend/share/share';
import { InvitePage } from '../pages/clinic/invite/invite';
import { BaiqiuyingPage } from "../pages/user/baiqiuying/baiqiuying";
import { CommomProblemPage } from "../pages/user/commom-problem/commom-problem";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    BasicPage,
    SettingPage,
    ForgetPage,
    ForgetPasswordPage,
    FriendIndexPage,
    ChatIndexPage,
    ClinicIndexPage,
    ScheduleIndexPage,
    BasicSearchPage,
    BasicClinicPage,
    BasicPaymentPage,
    BasicCalculateModalPage,
    BasicIdentityPage,
    AddHospitalModal,
    AddClinicModal,
    JoinClinicPage,
    PartnerPage,
    PatientPage,
    BasicIntroducePage,
    BasicProjectPage,
    BasicSearchProjectPage,
    AddProjectModal,
    ClinicHomePage,
    DoctorHomePage,
    SystemPage,
    FeedbackPage,
    AboutusPage,
    ConnectPage,
    // FriendPartnerPage,
    KnowPage,
    FirstPage,
    // JoinPage,
    ChatHomePage,
    PicModal,
    AutoresizeDirective,
    SetAction,
    FinishRender,
    SharePage,
    InvitePage,
    BaiqiuyingPage,
    SetHeight,
    CommomProblemPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
        backButtonText: '返回',
        // mode: 'ios',
        iconMode: 'ios',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'bottom',
        pageTransition: 'ios-transition',
        tabsHideOnSubPages: true
    }),
    IndexListModule,
    MultiPickerModule,
    IonicStorageModule.forRoot({
      name: '_bsxq'
      // driverOrder: ['websql']
    }),
    IonJPushModule,
    QRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    RegisterPage,
    BasicPage,
    SettingPage,
    ForgetPage,
    ForgetPasswordPage,
    FriendIndexPage,
    ChatIndexPage,
    ClinicIndexPage,
    ScheduleIndexPage,
    BasicSearchPage,
    BasicClinicPage,
    BasicPaymentPage,
    BasicCalculateModalPage,
    BasicIdentityPage,
    AddHospitalModal,
    AddClinicModal,
    JoinClinicPage,
    PartnerPage,
    PatientPage,
    BasicIntroducePage,
    BasicProjectPage,
    BasicSearchProjectPage,
    AddProjectModal,
    ClinicHomePage,
    DoctorHomePage,
    SystemPage,
    FeedbackPage,
    AboutusPage,
    ConnectPage,
    // FriendPartnerPage,
    KnowPage,
    FirstPage,
    // JoinPage,
    ChatHomePage,
    PicModal,
    SharePage,
    InvitePage,
    BaiqiuyingPage,
    CommomProblemPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    AppShare,
    Camera,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Keyboard,
    // ImagePicker,
    File,
    FileTransfer,
    PhotoLibrary
  ]
})
export class AppModule{}
