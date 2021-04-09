import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AuthorizationPageRoutingModule} from './authorization-routing.module';

import {AuthorizationPage} from './authorization.page';
import {LoginFbComponent} from "./login-fb/login-fb.component";
import {Facebook} from "@ionic-native/facebook/ngx";
import {Uid} from "@ionic-native/uid/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {Device} from "@ionic-native/device/ngx";
import {LoginComponent} from "./login/login.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AuthorizationPageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [LoginFbComponent, LoginComponent],
    providers: [
        Facebook, Uid, AndroidPermissions, Device
    ]
})
export class AuthorizationPageModule {
}
