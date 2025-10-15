import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
