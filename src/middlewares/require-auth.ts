import { NextFunction, Request, Response } from 'express';
import { NotAuthenticatedError } from '../errors';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthenticatedError('you have to be logged in');
  }
  next();
};
