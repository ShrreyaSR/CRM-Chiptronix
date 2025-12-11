import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SalesPerson {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  name: string | undefined;

  @Column({ type: "varchar", nullable: true })
  email: string | undefined;

  @Column({ type: "varchar" })
  password: string | undefined;

  @Column({ type: "varchar" })
  phone: string | undefined;

  @Column({ type: "date", nullable: true })
  dob: string | undefined;

  @Column({ type: "date", nullable: true })
  doj: string | undefined;

  @Column({ type: "varchar", nullable: true })
  address: string | undefined;
}
