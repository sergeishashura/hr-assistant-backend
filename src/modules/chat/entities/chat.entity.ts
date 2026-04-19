import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Column,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Message } from './message.entity';
import { unixTransformer } from 'src/utils/timeFormatter';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn({
    type: 'int',
    transformer: unixTransformer,
  })
  created_at: number;

  @UpdateDateColumn({
    type: 'int',
    transformer: unixTransformer,
  })
  updated_at: number;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
