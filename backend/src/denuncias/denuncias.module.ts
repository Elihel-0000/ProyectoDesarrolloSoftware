import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { DenunciasController } from './denuncias.controller';
import { StatsController } from './stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DenunciasController, StatsController],
  providers: [DenunciasService],
})
export class DenunciasModule {}
