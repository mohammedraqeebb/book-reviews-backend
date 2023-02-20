import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export type UserPayload = {
  id: string;
  email: string;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization.replace('Bearer ', '');

  if (!req.headers.authorization) {
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    req.currentUser = payload;
  } catch (err) {}
  return next();
};
