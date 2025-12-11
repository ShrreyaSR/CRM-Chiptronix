import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  name: string | undefined;

  @Column({ type: "varchar", nullable: true })
  email: string | undefined;

  @Column({ type: "varchar" })
  phone: string | undefined;

  @Column({ type: "varchar", nullable: true })
  address: string | undefined;

  @Column({ type: "varchar" })
  clientType: "Dealer" | "Customer" | undefined;

  @Column({ type: "varchar", nullable: true })
  passwordIfDealer: string | undefined;
}
