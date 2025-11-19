import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  createChat() {
    return this.chatService.createChat();
  }

  @Get(':id/history')
  getHistory(@Param('id') id: number) {
    return this.chatService.getChatHistory(id);
  }

  @Get(':id/question')
  getQuestion(@Param('id') id: number) {
    return this.chatService.getQuestion(id);
  }

  @Post(':id/answer')
  answer(
    @Param('id') id: number,
    @Body() body: { question: string; user_answer: string },
  ) {
    return this.chatService.evaluate(id, body.question, body.user_answer);
  }
}
