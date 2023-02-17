import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from './middlewares';
import {
  authorRouter,
  publisherRouter,
  authRouter,
  bookRouter,
  commentRouter,
  ratingRouter,
  savedBooksRouter,
  userRouter,
} from './routes';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

export const app: Express = express();

app.set('trust proxy', true);
// app.use(limiter);
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
//   );

//   res.header(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
//   );

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     res.setHeader('Allow', 'POST');
//     res.status(200).end();
//     return;
//   }
//   console.log(req.headers.origin);

//   next();
// });
const allowedOrigins = [
  'https://book-reviews-frontend.vercel.app',
  'https://book-reviews-mohammedraqeebb.vercel.app',
  'https://book-reviews-frontend-react.vercel.app',
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  cookieSession({
    secure: true,
    signed: false,
    // sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  })
);

app.use(currentUser);

app.use('/api/auth', authRouter);
app.use('/api/author', authorRouter);
app.use('/api/publisher', publisherRouter);
app.use('/api/book', bookRouter);
app.use('/api/book/comment', commentRouter);
app.use('/api/book/rating', ratingRouter);
app.use('/api/book/saved', savedBooksRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);
