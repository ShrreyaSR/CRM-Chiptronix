import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { AdminUser } from "../entities/AdminUser";
import { Technician } from "../entities/Technician";
import { SalesPerson } from "../entities/SalesPerson";
import { Client } from "../entities/Client";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export type UserRole = "super-admin" | "admin" | "technician" | "sales" | "client";

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    role: UserRole;
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
  };
}

export class AuthService {
  private adminRepo = AppDataSource.getRepository(AdminUser);
  private technicianRepo = AppDataSource.getRepository(Technician);
  private salesPersonRepo = AppDataSource.getRepository(SalesPerson);
  private clientRepo = AppDataSource.getRepository(Client);

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { emailOrPhone, password, role } = credentials;

    try {
      if (role === "super-admin" || role === "admin") {
        return await this.loginAdmin(emailOrPhone, password, role);
      } else if (role === "technician") {
        return await this.loginTechnician(emailOrPhone, password);
      } else if (role === "sales") {
        return await this.loginSalesPerson(emailOrPhone, password);
      } else if (role === "client") {
        return await this.loginDealer(emailOrPhone, password);
      } else {
        throw new AppError("Invalid role", 400);
      }
    } catch (error) {
      logger.error("Login failed", { emailOrPhone, role, error });
      throw error;
    }
  }

  private async loginAdmin(
    usernameOrEmail: string,
    password: string,
    requiredRole: "admin" | "super-admin"
  ): Promise<AuthResponse> {
    const admin = await this.adminRepo.findOne({
      where: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });

    if (!admin) {
      throw new AppError("Invalid credentials", 401);
    }

    if (admin.role !== requiredRole) {
      throw new AppError("Access denied. Invalid role.", 403);
    }

    // Check if password is hashed (starts with $2b$) or plain text
    let isPasswordValid = false;
    if (admin.password!.startsWith("$2b$") || admin.password!.startsWith("$2a$") || admin.password!.startsWith("$2y$")) {
      // Hashed password
      isPasswordValid = await bcrypt.compare(password, admin.password!);
    } else {
      // Plain text password (for backwards compatibility)
      isPasswordValid = password === admin.password;
    }
    
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(admin.id!, requiredRole, {
      name: admin.name,
      email: admin.email,
      username: admin.username,
    });

    return {
      token,
      user: {
        id: admin.id!,
        role: requiredRole,
        name: admin.name,
        email: admin.email,
        username: admin.username,
      },
    };
  }

  private async loginTechnician(
    emailOrPhone: string,
    password: string
  ): Promise<AuthResponse> {
    const technician = await this.technicianRepo.findOne({
      where: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
    });

    if (!technician) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!technician.password) {
      throw new AppError("Password not set for this user", 401);
    }

    // Check if password is hashed or plain text
    let isPasswordValid = false;
    if (technician.password.startsWith("$2b$") || technician.password.startsWith("$2a$") || technician.password.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(password, technician.password);
    } else {
      isPasswordValid = password === technician.password;
    }
    
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(technician.id!, "technician", {
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
    });

    return {
      token,
      user: {
        id: technician.id!,
        role: "technician",
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
      },
    };
  }

  private async loginSalesPerson(
    emailOrPhone: string,
    password: string
  ): Promise<AuthResponse> {
    const salesPerson = await this.salesPersonRepo.findOne({
      where: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
    });

    if (!salesPerson) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!salesPerson.password) {
      throw new AppError("Password not set for this user", 401);
    }

    // Check if password is hashed or plain text
    let isPasswordValid = false;
    if (salesPerson.password.startsWith("$2b$") || salesPerson.password.startsWith("$2a$") || salesPerson.password.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(password, salesPerson.password);
    } else {
      isPasswordValid = password === salesPerson.password;
    }
    
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(salesPerson.id!, "sales", {
      name: salesPerson.name,
      email: salesPerson.email,
      phone: salesPerson.phone,
    });

    return {
      token,
      user: {
        id: salesPerson.id!,
        role: "sales",
        name: salesPerson.name,
        email: salesPerson.email,
        phone: salesPerson.phone,
      },
    };
  }

  private async loginDealer(
    emailOrPhone: string,
    password: string
  ): Promise<AuthResponse> {
    const client = await this.clientRepo.findOne({
      where: [
        { email: emailOrPhone, clientType: "Dealer" },
        { phone: emailOrPhone, clientType: "Dealer" },
      ],
    });

    if (!client) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!client.passwordIfDealer) {
      throw new AppError("Password not set for this dealer", 401);
    }

    // Check if password is hashed or plain text
    let isPasswordValid = false;
    if (client.passwordIfDealer!.startsWith("$2b$") || client.passwordIfDealer!.startsWith("$2a$") || client.passwordIfDealer!.startsWith("$2y$")) {
      isPasswordValid = await bcrypt.compare(password, client.passwordIfDealer!);
    } else {
      isPasswordValid = password === client.passwordIfDealer;
    }
    
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(client.id!, "client", {
      name: client.name,
      email: client.email,
      phone: client.phone,
    });

    return {
      token,
      user: {
        id: client.id!,
        role: "client",
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    };
  }

  private generateToken(
    userId: number,
    role: UserRole,
    additionalData: any = {}
  ): string {
    const payload = {
      userId,
      role,
      ...additionalData,
    };

    const expiresIn: string = String(env.jwt.expiresIn || "7d");
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: expiresIn,
    } as jwt.SignOptions);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, env.jwt.secret);
      return decoded;
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
