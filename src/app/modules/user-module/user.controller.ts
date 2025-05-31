import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import handleAsync from '../../../shared/handleAsync';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import createUser from './services/create-user';
import User from './user.model';

const registerController = handleAsync(async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await User.findOne({ $or: [{ email: userData.email, phone: userData.phone }] });

  if (user) {
    throw new CustomError.BadRequestError('email or phone already exist');
  }

  const result = await createUser(userData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User registration successful.Check email for verify your email',
    data: result,
  });
});

export default {
  registerController,
};
