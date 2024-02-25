import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ConfigModule } from '@nestjs/config';
import { PostRepository } from './post.repository';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../shared/database/database.module';
import { VotesModule } from '../votes/votes.module';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  imports: [
    ConfigModule, 
    AuthModule, 
    DatabaseModule,
    VotesModule]
})
export class PostModule {}
