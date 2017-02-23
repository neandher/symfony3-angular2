import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from "@angular/router";

import {SharedModule} from "../shared/shared.module";
import {VideoEditorComponent} from './video-editor/video-editor.component';
import {VideosComponent} from './videos.component';
import {VideoUploadComponent} from './video-upload/video-upload.component';
import {AuthGuard} from "../shared/services/auth.guard";
import {FileUploadModule} from "ng2-file-upload";

const videosRouting: ModuleWithProviders = RouterModule.forChild([
  {path: 'upload', component: VideoUploadComponent, canActivate: [AuthGuard]},
]);

@NgModule({
  imports: [
    SharedModule,
    FileUploadModule,
    videosRouting,
  ],
  declarations: [
    VideoEditorComponent,
    VideosComponent,
    VideoUploadComponent
  ]
})
export class VideosModule {
}
