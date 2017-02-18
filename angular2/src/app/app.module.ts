import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {routing} from "./app.routes";
import {HeaderComponent} from "./shared/layout/header/header.component";
import {AuthModule} from "./auth/auth.module";
import {HomeModule} from "./home/home.module";
import {SharedModule} from "./shared/shared.module";
import {ApiService} from "./shared/services/api.service";
import {AuthGuard} from "./shared/services/auth.guard";
import {JwtService} from "./shared/services/jwt.service";
import {UserService} from "./shared/services/user.service";
import {AuthHttp} from "angular2-jwt";
import {AuthProvider} from "./shared/services/auth.provider";
import {SettingsModule} from "./settings/settings.module";
import {ChannelModule} from "./channel/channel.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    AuthModule,
    HomeModule,
    SharedModule,
    SettingsModule,
    ChannelModule,
  ],
  providers: [
    ApiService,
    AuthGuard,
    {provide: AuthHttp, useClass: AuthProvider},
    JwtService,
    UserService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
