import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../shared/database/database.module';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [
    DatabaseModule, 
    forwardRef( () => AuthModule )
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
