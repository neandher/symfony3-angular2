import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

import {AppComponent} from './app.component';
import {SignInComponent} from './components/signin.component';
import {SignUpComponent} from './components/signup.component';
import {DefaultComponent} from './components/default.component';
import {routing} from "./app.routes";
import {ChannelComponent} from './components/channel.component';
import {AuthGuard} from "./auth/auth.guard";
import {AuthProvider} from "./auth/auth.provider";
import {HeaderComponent} from './components/header.component';
import {AuthService} from "./auth/auth.service";
import { UserEditComponent } from './components/user-edit.component';
import { UserChangePasswordComponent } from './components/user-change-password.component';
import { MessageAlertComponent } from './components/message-alert/message-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DefaultComponent,
    ChannelComponent,
    HeaderComponent,
    UserEditComponent,
    UserChangePasswordComponent,
    MessageAlertComponent
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
    AuthService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
