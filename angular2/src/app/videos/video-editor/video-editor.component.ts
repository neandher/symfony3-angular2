import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {BaseComponent} from "../../base.component";
import {Video} from "../../shared/models/video";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../video.service";

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
})
export class VideoEditorComponent extends BaseComponent implements OnInit, OnDestroy {

  private isNew: boolean = true;
  private video: Video;
  private subscription: Subscription;
  public status: string = '';
  public isSubmitting: boolean = false;
  public form: FormGroup;
  public error: string[] = [];
  public formErrors: Object = {
    'title': [],
    'description': [],
    'status': [],
  };

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private videoService: VideoService) {
    super();
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          let id = params['id'];
          this.isNew = false;
          this.videoService.get(id).subscribe(
            response => this.video = response
          );
        } else {
          this.isNew = true;
          this.video = null;
        }
        this.buildForm();
      }
    );
  }

  buildForm(): void {

    let videoTitle = '';
    let videoDescription = '';
    let videoStatus = '';

    if (!this.isNew) {
      videoTitle = this.video.title;
      videoDescription = this.video.description;
      videoStatus = this.video.status;
    }

    this.form = this.fb.group({
      title: [videoTitle, [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
      description: [videoDescription, [Validators.required, Validators.minLength(4), Validators.maxLength(250)]],
      status: [videoStatus, [Validators.required]],
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  callVideoStatus(value) {
    this.video.status = value;
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];
    const newVideo = this.form.value;
    if (this.isNew) {
      this.videoService.save(newVideo);
    } else {
      this.videoService.save(newVideo).subscribe(
        response => {
          this.video = response;
          this.isSubmitting = false;
          this.status = 'success';
        },
        errorResponse => {
          this.error = [];
          this.handleResponseError(errorResponse);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onValueChanged() {
    this.handleError(this.form);
  }
}
