import {Routes, RouterModule} from '@angular/router';

import {DefaultComponent} from "./components/default.component";
import {SignInComponent} from "./components/signin.component";
import {SignUpComponent} from "./components/signup.component";
import {ChannelComponent} from "./components/channel.component";
import {AuthGuard} from "./common/auth.guard";

const APP_ROUTE: Routes = [
  {path: '', component: DefaultComponent},
  {path: 'login', component: SignInComponent},
  {path: 'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'channel', component: ChannelComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forRoot(APP_ROUTE);
