import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: { userId: number } }) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: { user: { userId: number } },
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }
}
