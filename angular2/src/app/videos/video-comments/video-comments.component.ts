import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from "./comment.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {ListResult} from "../../shared/interface/list-result.interface";
import {Comment} from "../../shared/models/comment";
import {BaseComponent} from "../../base.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/user";
import {Video} from "../../shared/models/video";

@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
})
export class VideoCommentsComponent extends BaseComponent implements OnInit {

  @Input() video: Video;
  public loading: boolean = false;
  public loadingNext: boolean = false;
  public user: User;
  public isSubmitting: boolean = false;
  public submit: boolean = false;
  public error: string[] = [];
  public form: FormGroup;
  public formErrors: Object = {
    'body': [],
  };

  constructor(private commentService: CommentService,
              private fb: FormBuilder,
              private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    if (this.video) {
      this.userService.currentUser.subscribe(
        userData => this.user = userData
      );
    }
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

  next() {
    this.loadingNext = true;
    this.commentService.query([], [], this.video.comments._links['next'], this.video.id).subscribe(
      (commentResponse: any) => {
        for (let item of commentResponse.items) {
          this.video.comments.items.push(item);
        }
        this.video.comments._links = commentResponse._links;
        this.loadingNext = false;
      },
      errorResponse => {
        console.log(errorResponse);
      }
    );
  }

  deleteComment(id: number) {
    let commentPanel = <HTMLElement>document.querySelector('.comment-panel-' + id);
    if (commentPanel != null) {
      commentPanel.style.display = 'none';
    }
    this.commentService.destroy(id).subscribe();
  }
}
