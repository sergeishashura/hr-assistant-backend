import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  getChatById(@Param('id') id: number, @Req() req: { user: { userId: number } }) {
    return this.chatService.getChatById(id, req.user.userId);
  }

  @Post('create')
  createChat(
    @Body() body: { title: string },
    @Req() req: { user: { userId: number } },
  ) {
    return this.chatService.createChat(req.user.userId, body.title ?? 'Новый чат');
  }

  @Get()
  getAllChats(@Req() req: { user: { userId: number } }) {
    return this.chatService.getAllChats(req.user.userId);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: number, @Req() req: { user: { userId: number } }) {
    return this.chatService.getChatHistory(id, req.user.userId);
  }

  @Get(':id/question')
  getQuestion(@Param('id') id: number, @Req() req: { user: { userId: number } }) {
    return this.chatService.getQuestion(id, req.user.userId);
  }

  @Post(':id/answer')
  answer(
    @Param('id') id: number,
    @Req() req: { user: { userId: number } },
    @Body() body: { question: string; user_answer: string },
  ) {
    return this.chatService.evaluate(
      id,
      req.user.userId,
      body.question,
      body.user_answer,
    );
  }
}
