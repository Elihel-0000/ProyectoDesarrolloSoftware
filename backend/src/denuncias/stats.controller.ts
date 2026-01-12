import { Controller, Get, UseGuards } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly denunciasService: DenunciasService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getStats() {
    return this.denunciasService.getStats();
  }
}
