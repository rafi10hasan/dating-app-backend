import { Request, Response } from 'express';
import handleAsync from '../../../shared/handleAsync';
import CustomError from '../../errors';
import User from './user.model';

const registerController = handleAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await User.findOne({ $or: [{ email: userData.email, phone: userData.phone }] });

  if (user) {
    throw new CustomError.BadRequestError('email already exist');
  }
});

export default {
  registerController,
};
