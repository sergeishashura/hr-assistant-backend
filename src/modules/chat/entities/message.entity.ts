import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

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

  @CreateDateColumn()
  created_at: Date;
}
