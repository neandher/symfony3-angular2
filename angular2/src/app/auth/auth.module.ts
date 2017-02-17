import {NgModule, ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SignInComponent} from "./signin/signin.component";
import {SignUpComponent} from "./signup/signup.component";
import {SharedModule} from "../shared/shared.module";

const AUTH_ROUTES: ModuleWithProviders  = RouterModule.forChild([
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
]);

@NgModule({
  imports: [
    AUTH_ROUTES,
    SharedModule
  ],
  declarations: [
    SignInComponent,
    SignUpComponent
  ],
  exports: []
})
export class AuthModule {
}
