import {Component, OnInit, NgZone} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";

import {FileUploader, FileItem} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {VideoService} from "../video.service";
import {UserService} from "../../shared/services/user.service";
import {BaseComponent} from "../../base.component";
import {Video} from "../../shared/models/video";

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html'
})
export class VideoUploadComponent extends BaseComponent implements OnInit {

  public uploader: FileUploader;
  public allowedMimeType: string[] = ['video/mp4'];
  public hasBaseDropZoneOver: boolean = false;
  public video: Video;
  public videoStatus: string = 'public';
  public miniatureNumber: number = 1;
  public uploadStarted: boolean = false;
  public uploadFinished: boolean = false;
  public form: FormGroup;
  public submit: boolean = false;
  public isSubmitting: boolean = false;
  public error: string[] = [];
  public formErrors: Object = {
    'title': [],
    'videoFile': []
  };

  constructor(private videoService: VideoService,
              private userService: UserService,
              private fb: FormBuilder,
              private zone: NgZone) {
    super();
  }

  private removeExtensionFromFile(fileName: string) {
    let newFileName: string[] = fileName.split('.');
    return fileName.replace('.' + newFileName[(newFileName.length - 1)], '');
  }

  ngOnInit() {

    this.clear();

    this.uploader.onWhenAddingFileFailed = () => {
      this.error.push('The file you are uploading may not be a valid video file');
      this.ngOnInit();
    };

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      this.error = [];
      this.video.title = this.removeExtensionFromFile(fileItem.file.name);
      this.video.status = this.videoStatus;
      this.video.user = this.userService.getCurrentUser().id;

      this.videoService.save(this.video).subscribe(
        (response: Video) => {
          this.video = response;
          this.uploadInit(fileItem)
        },
        errorResponse => console.log(errorResponse)
      );
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  private uploadInit(fileItem: FileItem) {

    this.uploadStarted = true;

    this.uploader = new FileUploader({
      url: `${environment.api_url}` + '/videos/' + this.video.id + '/upload',
      authToken: this.userService.getCurrentUserToken(true),
      itemAlias: 'videoFile'
    });

    this.uploader.addToQueue([fileItem._file]);

    this.formBuilder();

    this.uploader.uploadAll();

    this.uploader.onProgressAll = (progress: any) => {
      this.zone.run(() => {
        this.uploader.progress = progress;
      });
    };

    this.uploader.onSuccessItem = (item: FileItem, response) => {
      let responseVideo: Video = JSON.parse(response);

      this.video.id = responseVideo.id;
      this.video.videoName = responseVideo.videoName;
      this.video.imagesUrl = responseVideo.imagesUrl;
      this.video.imagesThumbsUrl = responseVideo.imagesThumbsUrl;
    };

    this.uploader.onCompleteAll = () => {
      this.uploadFinished = true;
    };

    this.uploader.onErrorItem = (item: FileItem, response) => {
      this.uploadStarted = false;
      this.handleResponseError(JSON.parse(response).errors);
      this.ngOnInit();
    };
  }

  private clear() {
    this.uploader = new FileUploader({allowedMimeType: this.allowedMimeType});
    this.video = new Video();
  }

  private formBuilder() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(150)]],
      description: [''],
      status: [''],
      miniatureNumber: [this.miniatureNumber],
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  private onValueChanged() {
    this.handleError(this.form);
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];

    this.videoService.save(this.form.value, this.video.id).subscribe(
      response => {
        this.submit = true;
      },
      responseError => {
        this.isSubmitting = false;
        this.handleResponseError(responseError.errors);

        console.log(responseError);
        //console.log(this.form.value);
      }
    );
  }

  setMiniatureNumber(number: number) {
    this.miniatureNumber = number;
    this.form.get('miniatureNumber').setValue(number);
  }
}
