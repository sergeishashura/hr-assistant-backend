import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Technology } from './entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly techRepo: Repository<Technology>,
  ) {}

  findAll(): Promise<Technology[]> {
    return this.techRepo.find();
  }

  async seedIfEmpty() {
    const count = await this.techRepo.count();
    if (count === 0) {
      await this.techRepo.insert([
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'SASS' },
        { name: 'Node.js' },
        { name: 'Python' },
        { name: 'C++' },
        { name: 'C' },
        { name: 'C#' },
        { name: 'Go' },
        { name: 'Rust' },
        { name: 'Java' },
        { name: 'Kotlin' },
        { name: 'Swift' },
        { name: 'Objective-C' },
        { name: 'Ruby' },
        { name: 'PHP' },
        { name: 'Perl' },
        { name: 'Scala' },
        { name: 'Elixir' },
        { name: 'Haskell' },
        { name: 'R' },
        { name: 'Dart' },
        { name: 'Lua' },
        { name: 'Shell' },
        { name: 'PowerShell' },
        { name: 'SQL' },
        { name: 'PL/SQL' },
        { name: 'MATLAB' },
        { name: 'Julia' },
        { name: 'Visual Basic .NET' },
        { name: 'F#' },
        { name: 'Groovy' },
        { name: 'VBA' },
        { name: 'COBOL' },
        { name: 'Fortran' },
        { name: 'Assembly' },
        { name: 'Solidity' },
        { name: 'VHDL' },
        { name: 'Erlang' },
        { name: 'Prolog' },
        { name: 'Nim' },
        { name: 'Crystal' },
      ]);
      console.log('Technologies seeded');
    }
  }
}
