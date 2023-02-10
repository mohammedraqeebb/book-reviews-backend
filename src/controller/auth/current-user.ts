import { Request, Response } from 'express';

export const currentUserInfo = (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(200).send({ user: null });
  }
  const { currentUser } = req;

  return res
    .status(200)
    .send({ user: { id: currentUser.id, name: currentUser.name } });
};
