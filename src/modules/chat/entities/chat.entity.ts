import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { unixTransformer } from 'src/utils/timeFormatter';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

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
