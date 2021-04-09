import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationPage } from './authorization.page';
import {LoginFbComponent} from "./login-fb/login-fb.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {
    path: '',
    component:LoginFbComponent
  },
  {
    path: 'loginPage',
    component:LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationPageRoutingModule {}
