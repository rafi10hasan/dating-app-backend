import { NextFunction } from "express";
import { extractTokenFromHeader, getUserByRole, validateUserRole, validateUserSpecificChecks, validateUserStatus, verifyAccessToken } from "./auth.utils";


const authentication = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractTokenFromHeader(req);

      const userPayload = verifyAccessToken(token);

      req.user = userPayload;

      const user = await getUserByRole(userPayload);

      validateUserStatus(user);
      validateUserSpecificChecks(user, userPayload);
      validateUserRole(userPayload.role, requiredRoles);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authentication