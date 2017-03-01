import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {SignInComponent} from "./signin/signin.component";
import {SignUpComponent} from "./signup/signup.component";

const authRoutes: Routes = [
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
