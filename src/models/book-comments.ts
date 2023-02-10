import mongoose from 'mongoose';
import { CommentDoc } from './comment';

interface BookCommentsAttrs {
  id: string;
  comments: CommentDoc[] | string[];
}
interface BookCommentsDoc extends mongoose.Document {
  id: string;
  comments: CommentDoc[] | string[];
}
interface BookCommentsModel extends mongoose.Model<BookCommentsDoc> {
  build(attrs: BookCommentsAttrs): BookCommentsDoc;
}

const bookCommentsSchema = new mongoose.Schema(
  {
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

bookCommentsSchema.statics.build = (attrs: BookCommentsAttrs) => {
  return new BookComments({
    _id: attrs.id,
    ...attrs,
  });
};

export const BookComments = mongoose.model<BookCommentsDoc, BookCommentsModel>(
  'BookComments',
  bookCommentsSchema
);
