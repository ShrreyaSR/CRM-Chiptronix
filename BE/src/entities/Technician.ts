import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Technician {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "varchar" })
  name: string | undefined;

  @Column({ type: "varchar" })
  email: string | undefined;

  @Column({ type: "varchar" })
  password: string | undefined;

  @Column({ type: "varchar" })
  phone: string | undefined;

  @Column({ type: "date" })
  dob: string | undefined;

  @Column({ type: "date" })
  doj: string | undefined;

  @Column({ type: "varchar" })
  address: string | undefined;

  @Column({ type: "varchar", nullable: true })
  idProofType: string | undefined;

  @Column({ type: "varchar", nullable: true  })
  idProof: string | undefined;
}


