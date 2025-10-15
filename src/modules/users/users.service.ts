import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Position } from '../positions/entities/position.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Position)
    private readonly positionsRepo: Repository<Position>,

    @InjectRepository(Technology)
    private readonly techRepo: Repository<Technology>,
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) throw new ConflictException('Username already exists');

    const positionExists = await this.positionsRepo.exists({
      where: { id: dto.position },
    });
    if (!positionExists) {
      throw new BadRequestException(
        `Position with id=${dto.position} does not exist`,
      );
    }

    if (dto.techStack.length === 0) {
      throw new BadRequestException('Tech stack cannot be empty');
    }

    const foundTech = await this.techRepo.find({
      where: { id: In(dto.techStack) },
    });

    if (foundTech.length !== dto.techStack.length) {
      const foundIds = foundTech.map((t) => t.id);
      const missing = dto.techStack.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Technologies not found: ${missing.join(', ')}`,
      );
    }

    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  async login(dto: UserLoginDto): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (!user || user.password !== dto.password)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this.usersRepo.find();
    return users.map((u) => ({
      ...u,
      techStack: u.techStack,
    }));
  }
}
