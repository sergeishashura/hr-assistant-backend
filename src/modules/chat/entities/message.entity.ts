import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { unixTransformer } from 'src/utils/timeFormatter';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column()
  role: string; // 'question' | 'user' | 'system' | 'model'

  @Column('text')
  text: string;

  @CreateDateColumn({
    type: 'int',
    transformer: unixTransformer,
  })
  created_at: number;
}
