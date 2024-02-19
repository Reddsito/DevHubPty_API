import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [],
  providers: [SharedService],
  imports: [DatabaseModule]
})
export class SharedModule {}
