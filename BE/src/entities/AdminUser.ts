import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("admin_user")
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar", unique: true })
  username: string | undefined;

  @Column({ type: "varchar" })
  password: string | undefined;

  @Column({ type: "varchar" })
  role: "admin" | "super-admin" | undefined;

  @Column({ type: "varchar", nullable: true })
  email: string | undefined;

  @Column({ type: "varchar", nullable: true })
  name: string | undefined;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date | undefined;
}
