import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('user_gamification_stats')
@Unique(['user'])
export class UserGamificationStats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  longestStreak: number;

  @Column({ default: 0 })
  totalActiveDays: number;

  @Column({ default: 0 })
  totalMessages: number;

  @Column({ default: 0 })
  totalChats: number;

  @Column({ type: 'text', nullable: true })
  lastActiveDate: string | null;
}
