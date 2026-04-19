import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserDailyActivity } from './entities/user-daily-activity.entity';
import { UserGamificationStats } from './entities/user-gamification-stats.entity';

type AchievementDefinition = {
  code: string;
  title: string;
  description: string;
  isUnlocked: (params: {
    stats: UserGamificationStats;
    dailyActivity: UserDailyActivity;
  }) => boolean;
};

const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    code: 'first_answer',
    title: 'First Step',
    description: 'Send your first answer in the interview simulator.',
    isUnlocked: ({ stats }) => stats.totalMessages >= 1,
  },
  {
    code: 'streak_3',
    title: 'On Fire 3',
    description: 'Stay active 3 days in a row.',
    isUnlocked: ({ stats }) => stats.currentStreak >= 3,
  },
  {
    code: 'streak_5',
    title: 'On Fire 5',
    description: 'Stay active 5 days in a row.',
    isUnlocked: ({ stats }) => stats.currentStreak >= 5,
  },
  {
    code: 'streak_15',
    title: 'On Fire 15',
    description: 'Stay active 15 days in a row.',
    isUnlocked: ({ stats }) => stats.currentStreak >= 15,
  },
  {
    code: 'chatter_20',
    title: 'Talker I',
    description: 'Send 20 answers in one day.',
    isUnlocked: ({ dailyActivity }) => dailyActivity.messagesCount >= 20,
  },
  {
    code: 'chatter_50',
    title: 'Talker II',
    description: 'Send 50 answers in one day.',
    isUnlocked: ({ dailyActivity }) => dailyActivity.messagesCount >= 50,
  },
  {
    code: 'chat_creator_10',
    title: 'Interviewer',
    description: 'Create 10 chats.',
    isUnlocked: ({ stats }) => stats.totalChats >= 10,
  },
  {
    code: 'chat_creator_25',
    title: 'Interview Architect',
    description: 'Create 25 chats.',
    isUnlocked: ({ stats }) => stats.totalChats >= 25,
  },
  {
    code: 'answer_100',
    title: 'Marathon Speaker',
    description: 'Send 100 answers in total.',
    isUnlocked: ({ stats }) => stats.totalMessages >= 100,
  },
];

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,

    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,

    @InjectRepository(UserDailyActivity)
    private readonly dailyActivityRepo: Repository<UserDailyActivity>,

    @InjectRepository(UserGamificationStats)
    private readonly statsRepo: Repository<UserGamificationStats>,
  ) {}

  async seedAchievementsIfEmpty() {
    const count = await this.achievementRepo.count();
    if (count > 0) return;

    await this.achievementRepo.insert(
      ACHIEVEMENT_DEFINITIONS.map(({ code, title, description }) => ({
        code,
        title,
        description,
      })),
    );
  }

  async recordChatCreated(userId: number) {
    const stats = await this.getOrCreateStats(userId);
    stats.totalChats += 1;
    await this.statsRepo.save(stats);

    const dailyActivity = await this.getOrCreateDailyActivity(userId, this.getTodayDate());
    dailyActivity.chatsCreated += 1;
    await this.dailyActivityRepo.save(dailyActivity);

    await this.unlockAchievements(userId, stats, dailyActivity);
  }

  async recordMessageSent(userId: number) {
    const today = this.getTodayDate();
    const stats = await this.getOrCreateStats(userId);
    const dailyActivity = await this.getOrCreateDailyActivity(userId, today);

    if (dailyActivity.messagesCount === 0) {
      this.applyDailyActivity(stats, today);
      await this.statsRepo.save(stats);
    }

    dailyActivity.messagesCount += 1;
    stats.totalMessages += 1;

    await this.dailyActivityRepo.save(dailyActivity);
    await this.statsRepo.save(stats);

    return this.unlockAchievements(userId, stats, dailyActivity);
  }

  async getProfile(userId: number) {
    const stats = await this.getOrCreateStats(userId);
    const today = this.getTodayDate();
    const dailyActivity = await this.getOrCreateDailyActivity(userId, today);
    const unlocked = await this.userAchievementRepo.find({
      where: { user: { id: userId } },
      relations: ['achievement'],
      order: { unlocked_at: 'DESC' },
    });

    return {
      stats: {
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        totalActiveDays: stats.totalActiveDays,
        totalMessages: stats.totalMessages,
        totalChats: stats.totalChats,
        lastActiveDate: stats.lastActiveDate,
      },
      today: {
        date: today,
        messagesCount: dailyActivity.messagesCount,
        chatsCreated: dailyActivity.chatsCreated,
      },
      achievements: unlocked.map((item) => ({
        code: item.achievement.code,
        title: item.achievement.title,
        description: item.achievement.description,
        unlockedAt: item.unlocked_at,
        isNew: item.isNew,
      })),
    };
  }

  async getAchievements(userId: number) {
    const [allAchievements, unlocked] = await Promise.all([
      this.achievementRepo.find({ order: { id: 'ASC' } }),
      this.userAchievementRepo.find({
        where: { user: { id: userId } },
        relations: ['achievement'],
      }),
    ]);

    const unlockedMap = new Map(
      unlocked.map((item) => [
        item.achievement.code,
        { unlockedAt: item.unlocked_at, isNew: item.isNew },
      ]),
    );

    return allAchievements.map((achievement) => ({
      code: achievement.code,
      title: achievement.title,
      description: achievement.description,
      unlocked: unlockedMap.has(achievement.code),
      unlockedAt: unlockedMap.get(achievement.code)?.unlockedAt ?? null,
      isNew: unlockedMap.get(achievement.code)?.isNew ?? false,
    }));
  }

  private async unlockAchievements(
    userId: number,
    stats: UserGamificationStats,
    dailyActivity: UserDailyActivity,
  ) {
    const [allAchievements, userAchievements] = await Promise.all([
      this.achievementRepo.find(),
      this.userAchievementRepo.find({
        where: { user: { id: userId } },
        relations: ['achievement'],
      }),
    ]);

    const unlockedCodes = new Set(
      userAchievements.map((item) => item.achievement.code),
    );

    const newAchievements = allAchievements.filter((achievement) => {
      const definition = ACHIEVEMENT_DEFINITIONS.find(
        (item) => item.code === achievement.code,
      );

      if (!definition || unlockedCodes.has(achievement.code)) return false;

      return definition.isUnlocked({ stats, dailyActivity });
    });

    if (newAchievements.length === 0) return [];

    const saved = await this.userAchievementRepo.save(
      newAchievements.map((achievement) =>
        this.userAchievementRepo.create({
          user: { id: userId },
          achievement: { id: achievement.id },
          isNew: true,
        }),
      ),
    );

    return saved.map((item) => ({
      id: item.id,
      achievementId: item.achievement.id,
    }));
  }

  private applyDailyActivity(stats: UserGamificationStats, today: string) {
    if (!stats.lastActiveDate) {
      stats.currentStreak = 1;
      stats.longestStreak = 1;
      stats.totalActiveDays = 1;
      stats.lastActiveDate = today;
      return;
    }

    if (stats.lastActiveDate === today) {
      return;
    }

    const previousDay = this.shiftDate(today, -1);
    stats.currentStreak = stats.lastActiveDate === previousDay
      ? stats.currentStreak + 1
      : 1;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    stats.totalActiveDays += 1;
    stats.lastActiveDate = today;
  }

  private async getOrCreateStats(userId: number) {
    let stats = await this.statsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      stats = this.statsRepo.create({
        user: { id: userId },
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        totalMessages: 0,
        totalChats: 0,
        lastActiveDate: null,
      });
      stats = await this.statsRepo.save(stats);
    }

    return stats;
  }

  private async getOrCreateDailyActivity(userId: number, date: string) {
    let dailyActivity = await this.dailyActivityRepo.findOne({
      where: { user: { id: userId }, date },
    });

    if (!dailyActivity) {
      dailyActivity = this.dailyActivityRepo.create({
        user: { id: userId },
        date,
        messagesCount: 0,
        chatsCreated: 0,
      });
      dailyActivity = await this.dailyActivityRepo.save(dailyActivity);
    }

    return dailyActivity;
  }

  private getTodayDate() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: process.env.APP_TIMEZONE || 'Europe/Minsk',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((item) => item.type === 'year')?.value;
    const month = parts.find((item) => item.type === 'month')?.value;
    const day = parts.find((item) => item.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  private shiftDate(date: string, amount: number) {
    const parsed = new Date(`${date}T00:00:00.000Z`);
    parsed.setUTCDate(parsed.getUTCDate() + amount);
    return parsed.toISOString().slice(0, 10);
  }
}
