import {Routes, RouterModule} from '@angular/router';

import {ChannelComponent} from "./components/channel.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {UserEditComponent} from "./settings/user-edit/user-edit.component";
import {UserChangePasswordComponent} from "./settings/user-change-password/user-change-password.component";

const APP_ROUTE: Routes = [
  {path: 'channel', component: ChannelComponent, canActivate: [AuthGuard]},
];

export const routing = RouterModule.forRoot(APP_ROUTE);
