import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthorizationPage} from "./authorization/authorization.page";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpConfigInterceptor} from "../shared/classes/HttpConfigInterceptor";
import {GroupDetailComponent} from "./tab2/group-detail/group-detail.component";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule} from "ngx-ui-loader";
import {ErrorInterceptor} from "../shared/classes/HttpConfigErrorInterceptor";
import {globalToast} from "../shared/classes/globalToast";
import {connectionRefused} from "../shared/classes/connectionRefused";
import { Network } from '@ionic-native/network/ngx';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {Facebook} from "@ionic-native/facebook/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {newNotification} from "../shared/classes/newNotification";
import {InAppBrowser} from "@ionic-native/in-app-browser/ngx";



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    "bgsColor": "#f4c41f",
    "bgsOpacity": 0.5,
    "bgsPosition": "bottom-right",
    "bgsSize": 60,
    "bgsType": "pulse", 
    "blur": 5,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#f4c41f",
    "fgsPosition": "center-center",
    "fgsSize": 60,
    "fgsType": "pulse",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(40, 40, 40, 0.8)",
    "pbColor": "#f4c41f",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "",
    "textColor": "#FFFFFF",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300,




};

@NgModule({
    declarations: [AppComponent, AuthorizationPage, GroupDetailComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        ReactiveFormsModule,
        FormsModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderHttpModule.forRoot({'showForeground': true, })],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        globalToast,
        connectionRefused,
        Network,
        FirebaseX,
        GooglePlus,
        Facebook,
        SocialSharing,
        newNotification,InAppBrowser
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
