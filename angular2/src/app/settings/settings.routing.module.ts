import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {UserEditComponent} from "./user-edit/user-edit.component";
import {UserChangePasswordComponent} from "./user-change-password/user-change-password.component";

const settingsRoutes: Routes = [
  {
    path: 'user-edit',
    component: UserEditComponent,
  },
  {
    path: 'user-change-password',
    component: UserChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
