import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { Position } from 'src/modules/positions/entities/position.entity';
import { Technology } from 'src/modules/technologies/entities/technology.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Message } from 'src/modules/chat/entities/message.entity';
import { Achievement } from 'src/modules/gamification/entities/achievement.entity';
import { UserAchievement } from 'src/modules/gamification/entities/user-achievement.entity';
import { UserDailyActivity } from 'src/modules/gamification/entities/user-daily-activity.entity';
import { UserGamificationStats } from 'src/modules/gamification/entities/user-gamification-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hr_assistant.db',
      entities: [
        User,
        Position,
        Technology,
        Chat,
        Message,
        Achievement,
        UserAchievement,
        UserDailyActivity,
        UserGamificationStats,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
