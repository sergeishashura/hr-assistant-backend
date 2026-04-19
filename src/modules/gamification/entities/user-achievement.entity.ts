import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { unixTransformer } from 'src/utils/timeFormatter';
import { User } from 'src/modules/users/entities/user.entity';
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
@Unique(['user', 'achievement'])
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Achievement, { nullable: false })
  achievement: Achievement;

  @CreateDateColumn({
    type: 'int',
    transformer: unixTransformer,
  })
  unlocked_at: number;

  @Column({ default: false })
  isNew: boolean;
}
