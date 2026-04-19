import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GamificationService } from './gamification.service';

@UseGuards(JwtAuthGuard)
@Controller('api/gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  getProfile(@Req() req: { user: { userId: number } }) {
    return this.gamificationService.getProfile(req.user.userId);
  }

  @Get('achievements')
  getAchievements(@Req() req: { user: { userId: number } }) {
    return this.gamificationService.getAchievements(req.user.userId);
  }
}
