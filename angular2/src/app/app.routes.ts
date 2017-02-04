import {Routes, RouterModule} from '@angular/router';

import {DefaultComponent} from "./components/default.component";
import {LoginComponent} from "./components/login.component";
import {RegisterComponent} from "./components/register.component";

const APP_ROUTE: Routes = [
  {path: '', component: DefaultComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTE);
