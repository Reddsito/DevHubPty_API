import { Module } from '@nestjs/common';
import { ArchivedPostsService } from './archived-posts.service';
import { ArchivedPostsController } from './archived-posts.controller';
import { DatabaseModule } from '../shared/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { ArchivedPostsRepository } from './archived-posts.repostiory';
import { PostModule } from '../posts/post.module';

@Module({
  controllers: [ArchivedPostsController],
  providers: [ArchivedPostsService, ArchivedPostsRepository],
  imports:[
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule
  ]
})
export class ArchivedPostsModule {}
