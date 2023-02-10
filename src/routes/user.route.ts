import { Router } from 'express';
import {
  userBookLikes,
  userBookViews,
  userNameChange,
} from '../controller/user';
import { requireAuth } from '../middlewares';

export const userRouter = Router();

userRouter.post('/likedbooks', requireAuth, userBookLikes);
userRouter.post('/viewedbooks', requireAuth, userBookViews);
userRouter.post('/namechange', requireAuth, userNameChange);
