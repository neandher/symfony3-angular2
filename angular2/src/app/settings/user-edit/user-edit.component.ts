import {Component, OnInit} from '@angular/core';

import {BaseComponent} from "../../base.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NGValidators} from "ng-validators";
import {User} from "../../shared/models/user";
import {UserService} from "../../shared/services/user.service";
import {FileUploader, FileItem} from "ng2-file-upload";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent extends BaseComponent implements OnInit {

  isSubmitting: boolean = false;
  user: User;
  status: string = '';
  error: string[] = [];
  form: FormGroup;
  submit: boolean = false;
  uploader: FileUploader;
  formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': []
  };

  constructor(private fb: FormBuilder, protected userService: UserService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
        this.uploader = new FileUploader(
          {
            url: `${environment.api_url}` + '/users/' + this.user.email + '/avatar',
            authToken: this.userService.getCurrentUserToken(true),
            itemAlias: 'avatarImageFile'
          }
        );
        this.uploader.onBeforeUploadItem = () => {
          this.error = [];
          this.status = '';
          this.isSubmitting = true;
        };
        this.uploader.onCompleteAll = () => {
          this.isSubmitting = false;
        };
        this.uploader.onSuccessItem = (item: FileItem, response) => {
          this.userService.setCurrentUser(JSON.parse(response));
          this.status = 'success';
        };
        this.uploader.onErrorItem = (item: FileItem, response) => {
          this.handleResponseError(JSON.parse(response).errors);
        };
      }
    );
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      email: ['', [Validators.required, NGValidators.isEmail()]],
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];

    this.userService.update(this.form.value).subscribe(
      response => {
        this.submit = true;
        this.status = 'success';
      },
      responseError => {
        this.isSubmitting = false;
        this.handleResponseError(responseError.errors);
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }

}
