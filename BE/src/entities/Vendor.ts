import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text" })
  name: string | undefined;
}
