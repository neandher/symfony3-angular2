import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from "@angular/router";

import {SharedModule} from "../shared/shared.module";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {UserChangePasswordComponent} from "./user-change-password/user-change-password.component";
import {AuthGuard} from "../shared/services/auth.guard";

const settingsRouting: ModuleWithProviders = RouterModule.forChild([
  {path: 'user-edit', component: UserEditComponent, canActivate: [AuthGuard]},
  {path: 'user-change-password', component: UserChangePasswordComponent, canActivate: [AuthGuard]},
]);

@NgModule({
  imports: [
    SharedModule,
    settingsRouting
  ],
  declarations: [
    UserEditComponent,
    UserChangePasswordComponent
  ]
})
export class SettingsModule {
}
