import {NgModule} from "@angular/core";

import {SignInComponent} from "./signin/signin.component";
import {SignUpComponent} from "./signup/signup.component";
import {SharedModule} from "../shared/shared.module";
import {AuthRoutingModule} from "./auth.routing.module";

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    SignInComponent,
    SignUpComponent
  ],
  exports: []
})
export class AuthModule {
}
