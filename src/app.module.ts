import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './modules/shared/database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { EmailModule } from './modules/email/email.module';
import { ConfigVariables } from '@/configuration/configuration';
import { PostModule } from './modules/posts/post.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ConfigVariables]
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    SharedModule,
    EmailModule,
    EventEmitterModule.forRoot(),
    PostModule,
    VotesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
