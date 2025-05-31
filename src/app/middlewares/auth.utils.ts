import config from "../../config";
import { ENUM_USER_ROLE } from "../../enums/user-role";
import jwtHelpers from "../../helpers/jwtHelpers";
import CustomError from "../errors";

const extractTokenFromHeader = (req: Request): string => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) throw new CustomError.UnAuthorizedError('Unauthorized access!');
  return token;
};

const verifyAccessToken = (token: string) => {
  const payload = jwtHelpers.verifyToken(token, config.jwt_access_token_secret);
  if (!payload) throw new CustomError.UnAuthorizedError('Invalid token!');
  return payload;
};

const getUserByRole = async (payload: any) => {
  const { id, role } = payload;

  const user = role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN
    ? await adminServices.getSpecificAdmin(id)
    : await userServices.getSpecificUser(id);

  if (!user) throw new CustomError.NotFoundError('User not found with the token');
  return user;
};

const validateUserStatus = (user: any) => {
  if (user.status === 'disabled') {
    throw new CustomError.BadRequestError('Your current account is disabled!');
  }
  if (user.status === 'blocked') {
    throw new CustomError.BadRequestError('Currently your account is blocked by admin!');
  }
};

const validateUserSpecificChecks = (user: any, payload: any) => {
  if (
    payload.role !== ENUM_USER_ROLE.ADMIN &&
    payload.role !== ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    if (!user.isEmailVerified) {
      throw new CustomError.UnAuthorizedError('Unauthorized user');
    }

    if (user.isDeleted) {
      throw new CustomError.BadRequestError('User not found');
    }
  }
};

const validateUserRole = (role: string, requiredRoles: string[]) => {
  if (requiredRoles.length && !requiredRoles.includes(role)) {
    throw new CustomError.ForbiddenError('Forbidden!');
  }
};
