import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from "../comment.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../base.component";
import {Video} from "../../../shared/models/video";

@Component({
  selector: 'app-video-component-add',
  templateUrl: 'video-component-add.component.html',
})
export class VideoComponentAddComponent extends BaseComponent implements OnInit {

  @Input() video: Video;
  public isSubmitting: boolean = false;
  public submit: boolean = false;
  public error: string[] = [];
  public form: FormGroup;
  public formErrors: Object = {
    'body': [],
  };

  constructor(private commentService: CommentService,
              private fb: FormBuilder,) {
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      body: ['', [Validators.required]]
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];

    this.commentService.save(this.form.value, null, this.video.id).subscribe(
      (commentSubmited: any) => {
        this.form.reset();
        this.video.comments.items.unshift(commentSubmited);
        this.submit = true;
      },
      responseError => {
        console.log(responseError);
        this.isSubmitting = false;
        this.handleResponseError(responseError.errors);
      }
    );
  }

  private onValueChanged() {
    this.handleError(this.form);
  }
}
