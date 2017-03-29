import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from "../comment.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../base.component";
import {Video} from "../../../shared/models/video";
import {Comment} from "../../../shared/models/comment";
import {ListResult} from "../../../shared/interface/list-result.interface";
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../shared/models/user";

declare let $: any;

@Component({
  selector: 'app-video-comments-add',
  templateUrl: 'video-comments-add.component.html',
})
export class VideoComponentAddComponent extends BaseComponent implements OnInit {

  @Input() video: Video;
  @Input() commentParent: Comment = null;
  @Input() elementId: string = '';
  public user: User;
  public isSubmitting: boolean = false;
  public submit: boolean = false;
  public form: FormGroup;

  constructor(private commentService: CommentService,
              private fb: FormBuilder,
              private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      body: ['', [Validators.required]],
      commentParent: ['']
    });
  }

  onSubmit() {

    this.isSubmitting = true;
    this.error = [];

    if (!this.commentParent) {
      this.form.removeControl('commentParent');
    }
    else {
      this.form.get('commentParent').setValue(this.commentParent.id);
    }

    this.commentService.save(this.form.value, null, this.video.id).subscribe(
      (commentSubmited: any) => {
        this.isSubmitting = false;
        this.resetForm();
        if (this.commentParent) {
          this.video.comments.items = this.video.comments.items.map((comment: any) => {
            if (this.commentParent.id == comment.id) {
              if (!comment.commentChildren) {
                comment.commentChildren = {'items': [commentSubmited]};
              }
              else {
                comment.commentChildren.items.push(commentSubmited);
              }
            }
            return comment;
          });
        }
        else {
          this.video.comments.items.unshift(commentSubmited);
          this.video.comments.total += 1;
          this.submit = true;
        }
      }
    );
  }

  resetForm() {
    $('#' + this.elementId).removeClass('comment-simplebox-content');
    this.form.reset();
  }
}
