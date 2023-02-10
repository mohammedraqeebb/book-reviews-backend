import { CustomError } from './custom-error';

export class NotAuthenticatedError extends CustomError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }
  statusCode = 401;
  serializeError() {
    return [{ message: 'you are not signed in' }];
  }
}
