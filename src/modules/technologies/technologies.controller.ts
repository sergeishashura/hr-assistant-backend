import { Controller, Get } from '@nestjs/common';

import { TechnologiesService } from './technologies.service';

@Controller('api/technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  findAll() {
    return this.technologiesService.findAll();
  }
}
