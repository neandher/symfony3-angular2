import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {AuthGuard} from "./shared/services/auth.guard";
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule',
  },
  {
    path: 'channel',
    loadChildren: 'app/channel/channel.module#ChannelModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: 'app/settings/settings.module#SettingsModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'videos',
    loadChildren: 'app/videos/videos.module#VideosModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: '',
    // loadChildren: 'app/home/home.module#HomeModule'
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  //imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
