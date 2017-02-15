import {Routes, RouterModule} from '@angular/router';

import {DefaultComponent} from "./components/default.component";
import {SignInComponent} from "./components/signin.component";
import {SignUpComponent} from "./components/signup.component";
import {ChannelComponent} from "./components/channel.component";
import {AuthGuard} from "./auth/auth.guard";
import {UserEditComponent} from "./components/user-edit.component";
import {UserChangePasswordComponent} from "./components/user-change-password.component";

const APP_ROUTE: Routes = [
  {path: '', component: DefaultComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'channel', component: ChannelComponent, canActivate: [AuthGuard]},
  {path: 'user-edit', component: UserEditComponent, canActivate: [AuthGuard]},
  {path: 'user-change-password', component: UserChangePasswordComponent, canActivate: [AuthGuard]},
];

export const routing = RouterModule.forRoot(APP_ROUTE);
