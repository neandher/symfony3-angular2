interface Validation {
  messages: Object;
}

export const validation: Validation = {
  messages: {
    'response_error': '',
    'required': 'This field is required.',
    'minlength': 'This field must be at least 4 characters long.',
    'maxlength': 'This field cannot be more than 24 characters long.',
    'passwordsEqual': 'Password mismatch.',
    'isEmail': 'Email invalid.'
  }
};
