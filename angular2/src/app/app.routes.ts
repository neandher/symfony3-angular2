import {RouterModule, Routes} from '@angular/router';

const APP_ROUTES: Routes = [
  {path: '', loadChildren: 'app/home/home.module#HomeModule'},
  {path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule'},
  {path: 'channel', loadChildren: 'app/channel/channel.module#ChannelModule'},
  {path: 'settings', loadChildren: 'app/settings/settings.module#SettingsModule'},
  {path: 'videos', loadChildren: 'app/videos/videos.module#VideosModule'},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
