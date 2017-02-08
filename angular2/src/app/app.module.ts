import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';
import {DefaultComponent} from './components/default.component';
import {routing} from "./app.routes";
import {ChannelComponent} from './components/channel.component';
import {AuthGuard} from "./common/auth.guard";
import {AuthProvider} from "./common/auth.provider";
import {HeaderComponent} from './components/header.component';
import {AuthService} from "./services/auth.service";
import {LogService} from "./services/log.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DefaultComponent,
    ChannelComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AuthGuard,
    {provide: AuthHttp, useClass: AuthProvider},
    AuthService,
    LogService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
