import {NgModule} from '@angular/core';

import {SharedModule} from "../shared/shared.module";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {UserChangePasswordComponent} from "./user-change-password/user-change-password.component";
import {FileUploadModule} from "ng2-file-upload";
import {SettingsRoutingModule} from "./settings.routing.module";

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule,
    FileUploadModule
  ],
  declarations: [
    UserEditComponent,
    UserChangePasswordComponent
  ]
})
export class SettingsModule {
}
