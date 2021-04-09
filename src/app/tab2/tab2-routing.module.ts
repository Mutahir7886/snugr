import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Tab2Page} from './tab2.page';
import {GroupDetailComponent} from "./group-detail/group-detail.component";

const routes: Routes = [
    {
        path: '',
        component: Tab2Page,
    },
    // {
    //     path: 'details/:id',
    //     component: GroupDetailComponent
    // },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab2PageRoutingModule {
}
