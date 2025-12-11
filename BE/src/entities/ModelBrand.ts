import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ModelBrand {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  brand: string | undefined;

  @Column({ type: "varchar" })
  model: string | undefined;

  @Column({ type: "text", nullable: true })
  description: string | undefined;
}
