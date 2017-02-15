import {FormGroup} from '@angular/forms';

export class EqualPasswordsValidator {

  public static validate(firstField, secondField) {

    return (c: FormGroup) => {

      return (c.root['controls'] && c.root.get(firstField).value === c.root.get(secondField).value) ? null : {
        passwordsEqual: {
          valid: false
        }
      };
    }
  }
}
