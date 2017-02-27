import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";

import {FileUploader, FileItem} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {VideoService} from "../../shared/services/video.service";
import {UserService} from "../../shared/services/user.service";
import {BaseComponent} from "../../base.component";
import {Video} from "../../shared/models/video";

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html'
})
export class VideoUploadComponent extends BaseComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;
  public video: Video = new Video();
  public videoStatus: string = 'public';
  public miniatureNumber: number;
  public uploadStarted = false;
  public uploadFinished = false;
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
              private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {

      this.video.title = fileItem.file.name;
      this.video.status = this.videoStatus;
      this.video.user = this.userService.getCurrentUser().id;

      this.videoService.save(this.video).subscribe(
        response => {
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

    this.uploader.onSuccessItem = (item: FileItem, response) => {
      this.video = JSON.parse(response);
    };

    this.uploader.onCompleteAll = () => {
      this.uploadFinished = true;
    };

    this.uploader.onErrorItem = (item: FileItem, response) => {
      this.videoService.destroy(this.video.id); // not working
      this.video = new Video();
      this.uploader = new FileUploader({});
      this.uploadStarted = false;
      this.handleResponseError(JSON.parse(response).errors);
      this.ngOnInit();
    };
  }

  formBuilder() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(150)]],
      description: [''],
      status: [''],
      miniatureNumber: [this.miniatureNumber],
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
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
