import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  statusCode = 401;
  serializeError() {
    return [{ message: this.message }];
  }
}
