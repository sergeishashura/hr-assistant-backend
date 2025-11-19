import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule } from './modules/positions/positions.module';
import { PositionsService } from './modules/positions/positions.service';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { TechnologiesService } from './modules/technologies/technologies.service';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ChatsModule,
    PositionsModule,
    TechnologiesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly technologiesService: TechnologiesService,
  ) {}

  async onModuleInit() {
    await this.positionsService.seedIfEmpty();
    await this.technologiesService.seedIfEmpty();
  }
}
