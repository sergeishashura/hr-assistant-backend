import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,
  ) {}

  findAll(): Promise<Position[]> {
    return this.positionsRepo.find();
  }

  async seedIfEmpty() {
    const count = await this.positionsRepo.count();
    if (count === 0) {
      await this.positionsRepo.insert([
        { name: 'Frontend Developer' },
        { name: 'Backend Developer' },
        { name: 'Fullstack Developer' },
        { name: 'Mobile Developer' },
        { name: 'iOS Developer' },
        { name: 'Android Developer' },
        { name: 'Flutter Developer' },
        { name: 'React Native Developer' },
        { name: 'Game Developer' },
        { name: 'DevOps Engineer' },
        { name: 'QA Engineer' },
        { name: 'Automation QA Engineer' },
        { name: 'Manual QA Engineer' },
        { name: 'UI/UX Designer' },
        { name: 'Product Designer' },
        { name: 'Graphic Designer' },
        { name: 'Motion Designer' },
        { name: 'Data Scientist' },
        { name: 'Data Analyst' },
        { name: 'ML Engineer' },
        { name: 'AI Researcher' },
        { name: 'SMM Strategist' },
        { name: 'Marketing Manager' },
        { name: 'Performance Marketer' },
        { name: 'Content Creator' },
        { name: 'Copywriter' },
        { name: 'Project Manager' },
        { name: 'Product Manager' },
        { name: 'Scrum Master' },
        { name: 'Business Analyst' },
        { name: 'System Analyst' },
        { name: 'Software Architect' },
        { name: 'Security Engineer' },
        { name: 'Blockchain Developer' },
        { name: 'Smart Contract Engineer' },
        { name: 'IoT Engineer' },
        { name: 'Cloud Engineer' },
        { name: 'Technical Support Engineer' },
        { name: 'Customer Success Manager' },
        { name: 'HR Specialist' },
        { name: 'Recruiter' },
        { name: 'Technical Writer' },
        { name: 'Research & Development Engineer' },
        { name: 'IT Trainer' },
        { name: 'AR/VR Developer' },
      ]);
    }
  }
}
