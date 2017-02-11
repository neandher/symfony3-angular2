import {FormGroup, FormControl} from "@angular/forms";

export class BaseComponent {

  protected form: FormGroup;
  protected error: string[] = [];
  protected formErrors: Object;

  protected handleResponseError(responseError: any[]) {

    for (let index in responseError) {
      var check = 0;
      for (let item of responseError[index]) {
        this.error.push(item);
        var path = this.getPathFormErrorResponse(index, this.form);
        this.formErrors[(path)].push(item);
        this.form.get(path).setErrors({"response_error": item});
        check++;
      }
      if (check == 0) {
        this.handleResponseError(responseError[index]);
      }
    }
  }

  protected getPathFormErrorResponse(field: string, control: any) {
    var path: string|null = null;

    for (var child in control.controls) {
      if (control.controls[child] instanceof FormControl) {
        if (field === child && path == null) {
          path = this.getPathFormError(control.controls[child]);
          break;
        }
      }
      else if (path == null) {
        path = this.getPathFormErrorResponse(field, control.controls[child]);
      }
    }
    return path;
  }

  protected getPathFormError(control) {
    var path: string = '';
    var parent = control.parent;

    while (parent instanceof FormGroup) {
      Object.keys(parent.controls).forEach((name) => {
        if (control === parent.controls[name]) {
          path += name + '.';
          control = parent;
        }
      });
      parent = parent.parent;
    }

    path = path.substr(0, (path.length - 1));
    var dotted = path.indexOf('.');

    if (dotted != -1) {
      var orderedArray: string[] = path.split('.');
      orderedArray = orderedArray.reverse();
      path = '';
      for (let i = 0; i < orderedArray.length; i++) {
        path += orderedArray[i] + '.';
      }
      path = path.substr(0, (path.length - 1));
    }

    return path;
  }

  protected handleError(control: any) {

    const pathFormError = this.getPathFormError(control);

    for (let error in control.errors) {
      if (this.formErrors[(pathFormError)].indexOf(this.validationMessages[error]) == -1) {
        this.formErrors[(pathFormError)].push(this.validationMessages[error]);
      }
    }
    for (var child in control.controls) {
      if (control.controls[child] instanceof FormControl) {
        this.formErrors[(this.getPathFormError(control.controls[child]))] = [];
        if (control.controls[child].dirty && !control.controls[child].valid) {
          this.handleError(control.controls[child]);
        }
      }
      else {
        this.handleError(control.controls[child]);
      }
    }
  }

  validationMessages: Object = {
    'response_error': '',
    'required': 'This field is required.',
    'minlength': 'This field must be at least 4 characters long.',
    'maxlength': 'This field cannot be more than 24 characters long.',
    'passwordsEqual': 'Password mismatch.',
    'isEmail': 'Email invalid.'
  };
}
