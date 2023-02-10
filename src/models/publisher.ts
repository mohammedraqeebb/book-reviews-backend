import mongoose from 'mongoose';

type PublisherAttrs = {
  name: string;
  userId: string;
  bio: string;
  street: string;
  state: string;
  establishedDate: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
};

interface PublisherDoc extends mongoose.Document {
  name: string;
  userId: string;
  bio: string;
  street: string;
  establishedDate: string;
  state: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  booksId: string[];
}

interface PublisherModel extends mongoose.Model<PublisherDoc> {
  build(attrs: PublisherAttrs): PublisherDoc;
}
const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    establishedDate: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
      max: 100,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    booksId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.books = ret.booksId;
        delete ret._id;
        delete ret.__v;
        delete ret.booksId;
      },
    },
  }
);
publisherSchema.statics.build = (attrs: PublisherAttrs) => {
  return new Publisher(attrs);
};

export const Publisher = mongoose.model<PublisherDoc, PublisherModel>(
  'Publisher',
  publisherSchema
);
