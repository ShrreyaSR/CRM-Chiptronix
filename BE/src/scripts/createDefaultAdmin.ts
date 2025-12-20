/**
 * Script to create default admin users
 * Run with: ts-node src/scripts/createDefaultAdmin.ts
 */

import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { AdminUser } from "../entities/AdminUser";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

async function createDefaultAdmin() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const adminRepo = AppDataSource.getRepository(AdminUser);

    // Check if admin users already exist
    const existingSuperAdmin = await adminRepo.findOne({
      where: { role: "super-admin" },
    });
    const existingAdmin = await adminRepo.findOne({
      where: { role: "admin" },
    });

    // Create super-admin if doesn't exist
    if (!existingSuperAdmin) {
      const superAdmin = adminRepo.create({
        username: "superadmin",
        password: "superadmin123",
        role: "super-admin",
        email: "superadmin@chiptronix.com",
        name: "Super Admin",
      });
      await adminRepo.save(superAdmin);
      console.log("✅ Super Admin created:");
      console.log("   Username: superadmin");
      console.log("   Password: superadmin123");
    } else {
      console.log("ℹ️  Super Admin already exists");
    }

    // Create admin if doesn't exist
    if (!existingAdmin) {
      const hashedPassword = await authService.hashPassword("admin123");
      const admin = adminRepo.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
        email: "admin@chiptronix.com",
        name: "Admin",
      });
      await adminRepo.save(admin);
      console.log("✅ Admin created:");
      console.log("   Username: admin");
      console.log("   Password: admin123");
    } else {
      console.log("ℹ️  Admin already exists");
    }

    console.log("\n✅ Default admin users setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating default admin:", error);
    process.exit(1);
  }
}

createDefaultAdmin();
