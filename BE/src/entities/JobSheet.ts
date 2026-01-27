import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Client } from "./Client";
import { ModelBrand } from "./ModelBrand";
import { Complaint } from "./Complaint";
import { Tray } from "./Tray";
import { Technician } from "./Technician";
import { Spares } from "./Spares";

@Entity()
export class JobSheet {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn()
  client: Client | undefined;

  @Column({ type: "varchar" })
  serviceType: string | undefined;

  @Column({ type: "varchar" })
  deviceType: string | undefined;

  @ManyToOne(() => ModelBrand, { eager: true })
  @JoinColumn()
  brand: ModelBrand | undefined;

  @Column({ type: "varchar" })
  color: string | undefined;

  @Column({ type: "varchar" })
  serialNumber: string | undefined;

  @ManyToMany(() => Complaint, { eager: true })
  @JoinTable()
  complaints: Complaint[] | undefined;

  @Column({ type: "text", nullable: true })
  problemsIdentified: string | undefined;

  @ManyToOne(() => Tray, { eager: true })
  @JoinColumn()
  tray: Tray | undefined;

  @Column({ type: "varchar", nullable: true })
  receivedFrom: string | undefined;

  @ManyToOne(() => Technician, { eager: true, nullable: true })
  @JoinColumn({ name: "assignedTo" })
  assignedTo: Technician | undefined;

  @ManyToOne(() => Technician, { eager: true })
  @JoinColumn({ name: "receivedBy" })
  receivedBy: Technician | undefined;

  @Column({ type: "numeric", nullable: true })
  estimateAmount: number | undefined;

  @Column({ type: "numeric", nullable: true })
  amountPaid: number | undefined;

  @Column({ type: "varchar", nullable: true })
  picture: string | undefined;

  @Column({ type: "varchar", default: "Pending" })
  status: string | undefined;

  @Column({ type: "timestamp", nullable: true })
  completedOn: Date | undefined;

  @CreateDateColumn({ name: "createdOn" })
  createdOn: Date | undefined;

  @ManyToOne(() => Spares, { eager: true, nullable: true })
  @JoinColumn({ name: "spares" })
  spares: Spares | undefined;

  @Column({ type: "numeric", nullable: true })
  totalAmount: number | undefined;

  @Column({ type: "text", nullable: true })
  fixSummary: string | undefined;
}







//   @Column({ type: "varchar", nullable: true })
//   picture: string | undefined;


//   @ManyToOne(() => Spares, { eager: true, nullable: true })
//   @JoinColumn({ name: "spares" })
//   spares: Spares | undefined;

