import { Module } from '@nestjs/common';
import { CommentVotesService } from './comment-votes.service';
import { CommentVotesController } from './comment-votes.controller';
import { DatabaseModule } from '../shared/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CommentsVoteRepository } from './comments_vote.repository';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [CommentVotesController],
  providers: [CommentVotesService, CommentsVoteRepository],
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule
  ]
})
export class CommentVotesModule {}
