import { Request, Response } from 'express';
import { Book } from '../../models/book';

export const mostLiked = async (req: Request, res: Response) => {
  const books = await Book.find({})
    .sort({ 'likes.length': -1 })
    .populate('authorIds')
    .limit(10);
  //   Book.aggregate([
  //      {
  //         $lookup: {
  //            from: 'users',
  //            localField: 'likes',
  //            foreignField: '_id',
  //             as: 'likes',
  //          },
  //       },
  //     { $unwind: '$likes' },
  //     {
  //         $group: {
  //            _id: '$_id',
  //            likes: { $sum: 1 },
  //          },
  //     },
  //     { $sort: { likes: -1 } },
  //    ])

  return res.status(200).send({ books });
};
