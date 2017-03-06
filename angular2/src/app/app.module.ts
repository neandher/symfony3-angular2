import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from "./shared/layout/header/header.component";
import {SharedModule} from "./shared/shared.module";
import {ApiService} from "./shared/services/api.service";
import {AuthGuard} from "./shared/services/auth.guard";
import {JwtService} from "./shared/services/jwt.service";
import {UserService} from "./shared/services/user.service";
import {AuthHttp} from "angular2-jwt";
import {AuthProvider} from "./shared/services/auth.provider";
import {AppRoutingModule} from "./app.routing.module";
import {HomeComponent} from "./home/home.component";
import {PagerService} from "./shared/services/pager.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    ApiService,
    AuthGuard,
    {provide: AuthHttp, useClass: AuthProvider},
    JwtService,
    UserService,
    PagerService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
