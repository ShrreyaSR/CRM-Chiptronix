import { Request, Response, NextFunction } from "express";
import { AuthService, LoginCredentials } from "../services/AuthService";
import { AppError } from "../middleware/errorHandler";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { emailOrPhone, password, role } = req.body;

      if (!emailOrPhone || !password || !role) {
        throw new AppError(
          "emailOrPhone, password, and role are required",
          400
        );
      }

      const credentials: LoginCredentials = {
        emailOrPhone,
        password,
        role,
      };

      const result = await authService.login(credentials);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      // This endpoint is used to verify if a token is still valid
      // The authenticate middleware already verified the token
      // So if we reach here, the token is valid
      res.json({
        success: true,
        message: "Token is valid",
      });
    } catch (error) {
      next(error);
    }
  }
}
