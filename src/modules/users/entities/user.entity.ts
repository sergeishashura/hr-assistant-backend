import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('int')
  position: number;

  @Column({
    type: 'text',
    transformer: {
      to: (value: number[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value), 
    },
  })
  techStack: number[];

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
