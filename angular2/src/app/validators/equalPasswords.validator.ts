import {FormGroup} from '@angular/forms';

export class EqualPasswordsValidator {

  public static validate(root, firstField, secondField) {

    return (c: FormGroup) => {

      return (c.root['controls'] && c.root['controls'][root].get(firstField).value === c.root['controls'][root].get(secondField).value)
        ? null : {
        passwordsEqual: {
          valid: false
        }
      };
    }
  }
}
