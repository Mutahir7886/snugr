import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';
import {ExploreContainerComponentModule} from '../explore-container/explore-container.module';

import {Tab2PageRoutingModule} from './tab2-routing.module';
import {Facebook} from "@ionic-native/facebook/ngx";
import {ModalPageComponent} from "./modal-page/modal-page.component";
import {GroupDetailComponent} from "./group-detail/group-detail.component";
import {AddParticpantModalComponent} from "./add-particpant-modal/add-particpant-modal.component";
import {TurnAllBulbModalComponent} from "./turn-all-bulb-modal/turn-all-bulb-modal.component";
import {globalToast} from "../../shared/classes/globalToast";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab2PageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [Tab2Page,ModalPageComponent,AddParticpantModalComponent,TurnAllBulbModalComponent],
    providers: [
        Facebook,globalToast
    ]

})
export class Tab2PageModule {
}
