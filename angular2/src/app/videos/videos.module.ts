import {NgModule} from '@angular/core';

import {SharedModule} from "../shared/shared.module";
import {VideoEditorComponent} from './video-editor/video-editor.component';
import {VideosComponent} from './videos.component';
import {VideoUploadComponent} from './video-upload/video-upload.component';
import {FileUploadModule} from "ng2-file-upload";
import {VideosRoutingModule} from "./videos.routing.module";
import {VideoService} from "./video.service";
import {VideoDetailComponent} from './video-detail/video-detail.component';
import { VideoLastsComponent } from './video-lasts/video-lasts.component';
import { VideoCommentsComponent } from './video-comments/video-comments.component';
import {CommentService} from "./video-comments/comment.service";

@NgModule({
  imports: [
    SharedModule,
    FileUploadModule,
    VideosRoutingModule,
  ],
  declarations: [
    VideoEditorComponent,
    VideosComponent,
    VideoUploadComponent,
    VideoDetailComponent,
    VideoLastsComponent,
    VideoCommentsComponent
  ],
  providers: [
    VideoService,
    CommentService
  ],
})
export class VideosModule {
}
