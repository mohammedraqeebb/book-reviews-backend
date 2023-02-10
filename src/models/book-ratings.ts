import mongoose from 'mongoose';

interface BookRatingsAttrs {
  id: string;
  ratings: string[];
}
interface BookRatingsDoc extends mongoose.Document {
  id: string;
  ratings: string[];
}
interface BookRatingsModel extends mongoose.Model<BookRatingsDoc> {
  build(attrs: BookRatingsAttrs): BookRatingsDoc;
}

const bookRatingsSchema = new mongoose.Schema(
  {
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

bookRatingsSchema.statics.build = (attrs: BookRatingsAttrs) => {
  return new BookRatings({
    _id: attrs.id,
    ...attrs,
  });
};

export const BookRatings = mongoose.model<BookRatingsDoc, BookRatingsModel>(
  'BookRatings',
  bookRatingsSchema
);
