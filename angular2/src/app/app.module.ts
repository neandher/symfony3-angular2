import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { AuthHttp} from 'angular2-jwt';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';
import {DefaultComponent} from './components/default.component';
import {routing} from "./app.routes";
import { ChannelComponent } from './components/channel.component';
import {AuthGuard} from "./common/auth-guard.service";
import {AuthProvider} from "./common/auth.provider";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DefaultComponent,
    ChannelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
    providers: [
      AuthGuard,
      {provide: AuthHttp, useClass : AuthProvider}
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
