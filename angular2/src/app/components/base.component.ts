import {FormGroup, FormControl} from "@angular/forms";
import {validation} from "../models/validation";

export class BaseComponent {

  protected form: FormGroup;
  protected error: string[] = [];
  protected formErrors: Object;

  protected handleResponseError(responseError: any[]) {

    let check: number;
    let path: string;

    for (let index in responseError) {
      check = 0;
      for (let item of responseError[index]) {
        path = this.getPathFormErrorResponse(index, this.form);
        this.error.push(item);
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

    let path: string|null = null;

    for (let child in control.controls) {
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

  protected getPathFormError(control: any) {

    let path: string = '';
    let parent = control.parent;

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
    let dotted = path.indexOf('.');

    if (dotted != -1) {
      let orderedArray: string[] = path.split('.').reverse();
      path = '';
      for (let i = 0; i < orderedArray.length; i++) {
        path += orderedArray[i] + '.';
      }
      path = path.substr(0, (path.length - 1));
    }

    return path;
  }

  protected handleError(control: any) {

    let pathFormError = this.getPathFormError(control);

    for (let error in control.errors) {
      if (this.formErrors[(pathFormError)].indexOf(validation.messages[error]) == -1) {
        this.formErrors[(pathFormError)].push(validation.messages[error]);
      }
    }
    for (let child in control.controls) {
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
}
