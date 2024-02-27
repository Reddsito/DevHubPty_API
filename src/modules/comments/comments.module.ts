import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from '../shared/database/database.module';
import { CommentsRepository } from './comments.repository';
import { AuthModule } from '../auth/auth.module';
import { PostModule } from '../posts/post.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  imports: [
    DatabaseModule,
    AuthModule,
    PostModule
  ]
})
export class CommentsModule {}
