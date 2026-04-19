import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PositionsModule } from '../positions/positions.module';
import { TechnologiesModule } from '../technologies/technologies.module';
import { GamificationModule } from '../gamification/gamification.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    PositionsModule,
    TechnologiesModule,
    GamificationModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatsModule {}
