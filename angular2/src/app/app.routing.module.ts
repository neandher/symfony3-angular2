import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

import {AuthGuard} from "./shared/services/auth.guard";
import {NotFoundComponent} from "./shared/layout/not-found/not-found.component";

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
  },
  {
    path: 'home',
    loadChildren: 'app/home/home.module#HomeModule'
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
