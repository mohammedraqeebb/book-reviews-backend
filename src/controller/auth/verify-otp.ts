import { Request, Response } from 'express';

import { BadRequestError } from '../../errors';
import { UserOtp } from '../../models/otp';
export const verifyotp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const userOtp = await UserOtp.findOne({ email });
  if (!userOtp) {
    throw new BadRequestError('otp expired, try again after a minute');
  }

  const hasTimeElapsed = new Date().getTime() - userOtp.expiresAt > 0;

  if (hasTimeElapsed) {
    throw new BadRequestError('time expired, try again');
  }

  if (parseInt(otp) !== userOtp.otp) {
    throw new BadRequestError('wrong otp');
  }
  return res.status(200).send({});
};
