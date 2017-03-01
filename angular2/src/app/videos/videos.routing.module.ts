import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {VideoUploadComponent} from "./video-upload/video-upload.component";
import {VideoDetailComponent} from "./video-detail/video-detail.component";

const videosRoutes: Routes = [
  {
    path: 'upload',
    component: VideoUploadComponent,
  },
  {
    path: ':id',
    component: VideoDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(videosRoutes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
