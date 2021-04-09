import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {GroupDetailComponent} from "./tab2/group-detail/group-detail.component";

const routes: Routes = [
    {
        path: 'alltabs',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: '',
        loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationPageModule)
    },
    {
        path: 'details/:id',
        component: GroupDetailComponent
    },


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
