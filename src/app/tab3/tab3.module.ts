import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import {Facebook} from "@ionic-native/facebook/ngx";
import {Uid} from "@ionic-native/uid/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {Device} from "@ionic-native/device/ngx";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
  ],
  declarations: [Tab3Page],
  providers:[
   Device
  ]
})
export class Tab3PageModule {}
