import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text" })
  description: string | undefined;
}