import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/access_jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-jwt.stategy';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypedEventEmitterModule } from 'src/event-mitter/event-emitter.module';



@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  imports: [
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    forwardRef( () => UserModule ),
    EventEmitterModule,
    TypedEventEmitterModule
  ],
  exports: [PassportModule, JwtStrategy, JwtModule]
})
export class AuthModule {}
