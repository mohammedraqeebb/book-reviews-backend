import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../../errors';
import { User } from '../../models/user';
import jwtDecode from 'jwt-decode';
import { SigninType } from '../../models/user';

type Decoded = {
  email: string;
  name: string;
};

export const googleSignin = async (req: Request, res: Response) => {
  const { token } = req.body;

  const decoded: Decoded = jwtDecode(token);

  const existingUser = await User.findOne({ email: decoded.email });
  if (existingUser && existingUser.type === SigninType.EmailAndPassword) {
    res.send({
      user: existingUser,
      message:
        'you already have an account with this email, enter your password to connect with your google account',
    });
  }
  let user;
  if (existingUser?.type === SigninType.Both) {
    user = await User.findOne({ email: decoded.email });
  } else if (!existingUser) {
    user = User.build({
      name: decoded.name,
      email: decoded.email,
      password: 'secretttt',
      type: SigninType.Google,
    });
    await user.save();
  }
  if (!user) {
    throw new BadRequestError('user not found');
  }

  const jwtToken = jwt.sign(
    {
      id: user._id,
      email: decoded.email,
      name: decoded.name,
    },
    process.env.JWT_SECRET!
  );
  req.session = {
    jwt: jwtToken,
  };
  return res.status(200).send({ user });
};
