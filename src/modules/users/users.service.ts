import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Position } from '../positions/entities/position.entity';
import { Technology } from '../technologies/entities/technology.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async register(dto: CreateUserDto): Promise<void> {
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

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
    });

    this.usersRepo.save(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { username },
    });

    if (!user) throw new UnauthorizedException('There is no such user');

    return user;
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('There is no such user');

    return this.toSafeUser(user);
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('There is no such user');

    if (dto.username && dto.username !== user.username) {
      const existing = await this.usersRepo.findOne({
        where: { username: dto.username },
      });

      if (existing) throw new ConflictException('Username already exists');
    }

    if (dto.position !== undefined) {
      const positionExists = await this.positionsRepo.exists({
        where: { id: dto.position },
      });

      if (!positionExists) {
        throw new BadRequestException(
          `Position with id=${dto.position} does not exist`,
        );
      }
    }

    if (dto.techStack !== undefined) {
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
    }

    if (dto.password !== undefined) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.position !== undefined) user.position = dto.position;
    if (dto.techStack !== undefined) user.techStack = dto.techStack;
    if (dto.username !== undefined) user.username = dto.username;

    const savedUser = await this.usersRepo.save(user);
    return this.toSafeUser(savedUser);
  }

  async getAll(): Promise<User[]> {
    const users = await this.usersRepo.find();
    return users.map((u) => this.toSafeUser(u) as User);
  }

  private toSafeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
