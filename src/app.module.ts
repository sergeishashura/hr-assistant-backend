import { Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule } from './modules/positions/positions.module';
import { PositionsService } from './modules/positions/positions.service';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { TechnologiesService } from './modules/technologies/technologies.service';

@Module({
  imports: [DatabaseModule, UsersModule, PositionsModule, TechnologiesModule],
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
