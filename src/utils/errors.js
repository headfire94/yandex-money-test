class MyError extends Error {
  constructor(m) {
    super(m);
    Object.setPrototypeOf(this, MyError.prototype);
  }
}

export const NOT_TEXT_ERROR = 'text is not string';
export const NO_CONTAINER = 'there is no container in DOM';
export const NO_FORM = 'there is no form in DOM';
export const NO_FIELDS = 'fields not presented';
export const NO_URL = 'url not presented';
export const NO_SUBMIT_BTN = 'there is no submitBtn in DOM';

export default MyError;
