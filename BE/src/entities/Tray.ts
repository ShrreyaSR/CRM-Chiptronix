import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(["trayNumber"])
export class Tray {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  trayNumber: number | undefined;

  @Column({ type: "varchar", default: "Free" })
  status: "Free" | "Occupied" | undefined;
}

