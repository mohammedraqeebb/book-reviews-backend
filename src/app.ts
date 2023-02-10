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

export const app: Express = express();
const allowedOrigins = [
  'https://book-reviews-frontend.vercel.app',
  'https://book-reviews-mohammedraqeebb.vercel.app',
  'https://book-reviews-rcaaejeq3-mohammedraqeebb.vercel.app',
];
app.set('trust proxy', 1);
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
//   res.header('Access-Control-Max-Age', '10000');
//   console.log(req.headers.origin);
//   next();
// });

const corsOptions = {
  origin: (origin: string, callback: any) => {
    console.log(origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: '*',
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

app.use(bodyParser.json());

app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false,
    sameSite: 'none',
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
