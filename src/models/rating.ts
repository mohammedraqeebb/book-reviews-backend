import mongoose from 'mongoose';

type Gender = 'male' | 'female';
type RatingAttrs = {
  bookId: string;
  rating: number;
  userId: string;
};

export interface RatingDoc extends mongoose.Document {
  bookId: string;
  rating: number;
  userId: string;
}

interface RatingModel extends mongoose.Model<RatingDoc> {
  build(attrs: RatingAttrs): RatingDoc;
}
const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
ratingSchema.statics.build = (attrs: RatingAttrs) => {
  return new Rating(attrs);
};
export const Rating = mongoose.model<RatingDoc, RatingModel>(
  'Rating',
  ratingSchema
);
