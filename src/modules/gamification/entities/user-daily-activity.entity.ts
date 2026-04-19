import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('user_daily_activity')
@Unique(['user', 'date'])
export class UserDailyActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'text' })
  date: string;

  @Column({ default: 0 })
  messagesCount: number;

  @Column({ default: 0 })
  chatsCreated: number;
}
