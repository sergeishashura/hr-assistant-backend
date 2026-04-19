import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserDailyActivity } from './entities/user-daily-activity.entity';
import { UserGamificationStats } from './entities/user-gamification-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      UserAchievement,
      UserDailyActivity,
      UserGamificationStats,
    ]),
    UsersModule,
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
