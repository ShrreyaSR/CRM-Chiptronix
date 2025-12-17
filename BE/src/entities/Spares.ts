import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SalesPerson } from "./SalesPerson";
import { Vendor } from "./Vendor";

@Entity()
export class Spares {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  product: string | undefined;

  @Column({ type: "varchar" })
  description: string | undefined;

  @Column({ type: "text", nullable: true })
  amount: string | undefined;

  @Column({ type: "text", nullable: true })
  billNumber: string | undefined;

  @Column({ type: "text", default: "Requested" })
  status: string | undefined;

  @ManyToOne(() => SalesPerson, { eager: true })
  @JoinColumn()
  salesPerson: SalesPerson | undefined;

  @ManyToOne(() => Vendor, { eager: true, nullable: true })
  @JoinColumn()
  vendor: Vendor | undefined;
}
