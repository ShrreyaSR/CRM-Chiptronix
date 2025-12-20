import { AppDataSource } from "../config/data-source";
import { AdminUser } from "../entities/AdminUser";

export const AdminUserRepository = AppDataSource.getRepository(AdminUser).extend(
  {}
);
