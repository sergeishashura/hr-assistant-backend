import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Position } from '../positions/entities/position.entity';
import { Technology } from '../technologies/entities/technology.entity';
import { PositionsModule } from '../positions/positions.module';
import { TechnologiesModule } from '../technologies/technologies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Position, Technology]),
    PositionsModule,
    TechnologiesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
