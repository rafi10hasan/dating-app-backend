import { Request, Response } from 'express';
import handleAsync from '../../../../../shared/handleAsync';

import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../../../../config';
import jwtHelpers from '../../../../../helpers/jwtHelpers';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import adminServices from '../../../admin-module/admin.services';

const adminLogin = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await adminServices.getAdminByEmail(email);

  if (!admin) throw new CustomError.NotFoundError('Invalid email or password!');

  // check the password is correct
  const isPasswordMatch = admin.comparePassword(password);

  if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password');

  // generate token
  const payload = {
    id: admin._id,
    email: admin.email,
    role: admin.role,
  };
  const accessToken = jwtHelpers.createToken(
    payload,
    config.jwt_access_token_secret as Secret,
    config.jwt_access_token_expiresin as string,
  );

  const refreshToken = jwtHelpers.createToken(
    payload,
    config.jwt_refresh_token_secret as Secret,
    config.jwt_refresh_token_expiresin as string,
  );

  const adminInfo = {
    fullName: admin.fullName,
    email: admin.email,
    _id: admin._id,
    accessToken,
    refreshToken,
    status: admin.status,
    role: admin.role,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Login successfull',
    data: adminInfo,
  });
});


export default adminLogin