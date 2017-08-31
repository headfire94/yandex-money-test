class MyError extends Error {
  constructor(m) {
    super(m);
    Object.setPrototypeOf(this, MyError.prototype);
  }
}

export const NOT_TEXT_ERROR = 'text is not string';

export default MyError;
