import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;
  serializeError() {
    return [{ message: this.message }];
  }
}
