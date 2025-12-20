import { Request, Response, NextFunction } from "express";
import { AuthService, UserRole } from "../services/AuthService";
import { AppError } from "./errorHandler";

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: UserRole;
    [key: string]: any;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.substring(7);
    const decoded = await authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

// Helper middleware to check if user can access a specific route
export const checkRouteAccess = (requiredRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    // Super-admin can access everything
    if (req.user.role === "super-admin") {
      return next();
    }

    // Users can only access their own role's routes
    if (req.user.role !== requiredRole) {
      return next(
        new AppError(
          `Access denied. ${req.user.role} cannot access ${requiredRole} routes.`,
          403
        )
      );
    }

    next();
  };
};
