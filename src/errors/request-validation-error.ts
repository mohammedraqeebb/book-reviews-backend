import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  constructor(public error: ValidationError[]) {
    super('invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  statusCode = 400;
  serializeError() {
    return this.error.map((currentError) => {
      const { msg, param } = currentError;
      return { message: msg, field: param };
    });
  }
}
