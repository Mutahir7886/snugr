import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { Device } from '@ionic-native/device/ngx';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import {Facebook} from "@ionic-native/facebook/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab1PageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [Tab1Page],
  providers:[
      Facebook,Uid,AndroidPermissions,Device
  ]
})
export class Tab1PageModule {}
