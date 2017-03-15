import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from "./comment.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {ListResult} from "../../shared/interface/list-result.interface";
import {Comment} from "../../shared/models/comment";
import {BaseComponent} from "../../base.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
})
export class VideoCommentsComponent extends BaseComponent implements OnInit {

  public comments: ListResult<Comment>;
  public loading: boolean = true;
  public loadingNext: boolean = false;
  @Input() videoId: number = 0;
  public user: User;
  public isSubmitting: boolean = false;
  public submit: boolean = false;
  public error: string[] = [];
  public form: FormGroup;
  public formErrors: Object = {
    'body': [],
  };

  constructor(private commentService: CommentService, private fb: FormBuilder, private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    if (this.videoId > 0) {
      this.userService.currentUser.subscribe(
        userData => this.user = userData
      );
      this.commentService.query([{'perpage': 2}], [], null, this.videoId).subscribe(
        response => {
          this.loading = false;
          this.comments = response;
        }
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

    this.commentService.save(this.form.value, null, this.videoId).subscribe(
      response => {
        this.form.reset();
        this.comments.items.unshift(response);
        console.log(this.comments.items);
        this.submit = true;
        console.log(response);
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

  deleteComment(id: number) {
    let commentPanel = <HTMLElement>document.querySelector('comment-panel-' + id);
    if (commentPanel != null) {
      commentPanel.style.display = 'none';
    }
    this.commentService.destroy(id);
  }

  next() {
    this.loadingNext = true;
    this.commentService.query([], [], this.comments._links['next'], this.videoId).subscribe(
      commentResponse => {
        for (let item of commentResponse.items) {
          this.comments.items.push(item);
        }
        this.comments._links = commentResponse._links;
        this.loadingNext = false;
      },
      errorResponse => {
        console.log(errorResponse);
      }
    );
  }
}
