import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { AuthModule } from '../auth/auth.module';
import { VotesRepository } from './votes.repository';
import { DatabaseModule } from '../shared/database/database.module';

@Module({
  controllers: [VotesController],
  providers: [VotesService, VotesRepository],
  imports: [AuthModule, DatabaseModule],
  exports: [VotesService, VotesRepository]
})
export class VotesModule {}
