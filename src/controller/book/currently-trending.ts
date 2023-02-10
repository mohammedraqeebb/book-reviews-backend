import { Request, Response } from 'express';

export const currentlyTrending = async (req: Request, res: Response) => {
  const today = new Date();
  const timePeriod = 14;
};
