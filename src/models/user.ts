import mongoose from 'mongoose';
import { PasswordManager } from '../utils/password-manager';

export enum SigninType {
  Google = 'googlesignin',
  Both = 'both',
  EmailAndPassword = 'emailandpassword',
}
type UserAttrs = {
  name: string;
  email: string;
  password: string;
  type: SigninType;
};

export interface UserDoc extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBanned: boolean;
  type: SigninType;
  bookViewsIds: string[];
  bookLikesIds: string[];
  bookDisLikesIds: string[];
  savedBookIds: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    signinType: {
      type: String,
      enum: Object.values(SigninType),
    },
    bookViewsIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    bookLikesIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    bookDisLikesIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    savedBookIds: [
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
        delete ret.password;
        delete ret._id;
        delete ret.isVerified;
        delete ret.__v;
        delete ret.isBanned;
        delete ret.bookDisLikesIds;
        delete ret.bookLikesIds;
        delete ret.bookViewsIds;
        delete ret.savedBookIds;
      },
    },
  }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await PasswordManager.hashPassword(this.password);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
