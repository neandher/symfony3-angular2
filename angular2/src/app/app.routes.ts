import {Routes, RouterModule} from '@angular/router';

import {DefaultComponent} from "./components/default.component";
import {LoginComponent} from "./components/login.component";
import {RegisterComponent} from "./components/register.component";
import {ChannelComponent} from "./components/channel.component";
import {AuthGuard} from "./common/auth.guard";

const APP_ROUTE: Routes = [
  {path: '', component: DefaultComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'channel', component: ChannelComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forRoot(APP_ROUTE);
