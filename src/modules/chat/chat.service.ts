import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import axios from 'axios';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    private readonly gamificationService: GamificationService,
  ) {}

  async getChatById(id: number, userId: number) {
    return this.getOwnedChat(id, userId);
  }

  async createChat(userId: number, title: string) {
    const chat = this.chatRepo.create({ title, user: { id: userId } });
    await this.chatRepo.save(chat);
    await this.gamificationService.recordChatCreated(userId);
    return chat;
  }

  async getAllChats(userId: number) {
    await this.assignLegacyChatsToUser(userId);

    return this.chatRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async getChatHistory(chatId: number, userId: number) {
    await this.assignLegacyChatToUser(chatId, userId);
    await this.getOwnedChat(chatId, userId);

    return this.msgRepo.find({
      where: { chat: { id: chatId } },
      order: { created_at: 'ASC' },
    });
  }

  async getQuestion(chatId: number, userId: number) {
    await this.assignLegacyChatToUser(chatId, userId);
    await this.getOwnedChat(chatId, userId);

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

    const saved = await this.msgRepo.save(msg);

    return saved;
  }

  async evaluate(
    chatId: number,
    userId: number,
    question: string,
    user_answer: string,
  ) {
    await this.assignLegacyChatToUser(chatId, userId);
    await this.getOwnedChat(chatId, userId);

    await this.msgRepo.save(
      this.msgRepo.create({
        chat: { id: chatId },
        role: 'user',
        text: user_answer,
      }),
    );

    const newlyUnlocked = await this.gamificationService.recordMessageSent(userId);

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

    const restMessage = await this.msgRepo.save(
      this.msgRepo.create({
        chat: { id: chatId },
        role: 'system',
        text: JSON.stringify(res.data.evaluation),
      }),
    );

    return {
      ...res.data,
      id: restMessage.id,
      created_at: restMessage.created_at,
      unlockedAchievements: newlyUnlocked,
    };
  }

  private async getOwnedChat(chatId: number, userId: number) {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId, user: { id: userId } },
      relations: ['user'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  private async assignLegacyChatsToUser(userId: number) {
    const ownedChatsCount = await this.chatRepo.count({
      where: { user: { id: userId } },
    });

    if (ownedChatsCount > 0) return;

    const legacyChats = await this.chatRepo.find({
      where: { user: IsNull() },
    });

    if (legacyChats.length === 0) return;

    await this.chatRepo.save(
      legacyChats.map((chat) => ({
        ...chat,
        user: { id: userId },
      })),
    );
  }

  private async assignLegacyChatToUser(chatId: number, userId: number) {
    const legacyChat = await this.chatRepo.findOne({
      where: { id: chatId, user: IsNull() },
    });

    if (!legacyChat) return;

    await this.chatRepo.save({
      ...legacyChat,
      user: { id: userId },
    });
  }
}
