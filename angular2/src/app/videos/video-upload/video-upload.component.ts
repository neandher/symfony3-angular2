import {Component, OnInit} from '@angular/core';
import {FileUploader, FileItem} from "ng2-file-upload";
import {environment} from "../../../environments/environment";



@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html'
})
export class VideoUploadComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      // post the basic info and create a vido
      // after send the video file to update a video entity and be happy
      console.log(fileItem);
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
