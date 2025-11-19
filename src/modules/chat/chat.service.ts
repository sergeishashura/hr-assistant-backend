import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  async createChat() {
    const chat = this.chatRepo.create();
    await this.chatRepo.save(chat);
    return chat;
  }

  async getChatHistory(chatId: number) {
    return this.msgRepo.find({
      where: { chat: { id: chatId } },
      order: { created_at: 'ASC' },
    });
  }

  async getQuestion(chatId: number) {
    const questions = [
      'Tell me about a time you had to learn something completely new quickly.',
      'Describe a time you handled a difficult situation professionally.',
      'Where do you see yourself in 5 years?',
      'Tell me about a conflict you had with a coworker and how you resolved it.',
      'What skills do you hope to develop in your next role?',
      "What's the most significant change you've had to adapt to at work?",
      'How does this role fit into your career path?',
      'Tell me about a time you worked well within a team.',
      'What are your expectations from leadership in a company?',
      'What motivates you to come to work every day?',
      'How do you motivate others in a leadership role?',
      'What tools or methods help you stay organized?',
      'How do you build trust with new teammates?',
      'Describe a time you led a project or team.',
      'Why do you want to work at our company?',
    ];

    const question = questions[Math.floor(Math.random() * questions.length)];

    const msg = this.msgRepo.create({
      chat: { id: chatId },
      role: 'question',
      text: question,
    });

    await this.msgRepo.save(msg);

    return { question };
  }

  async evaluate(chatId: number, question: string, user_answer: string) {
    await this.msgRepo.save(
      this.msgRepo.create({
        chat: { id: chatId },
        role: 'user',
        text: user_answer,
      }),
    );

    const res = await axios.post('http://localhost:8000/evaluate', {
      question,
      user_answer,
    });

    await this.msgRepo.save(
      this.msgRepo.create({
        chat: { id: chatId },
        role: 'model',
        text: res.data.model_answer,
      }),
    );

    await this.msgRepo.save(
      this.msgRepo.create({
        chat: { id: chatId },
        role: 'system',
        text: JSON.stringify(res.data.evaluation),
      }),
    );

    return res.data;
  }
}
