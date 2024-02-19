import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express'
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../interfaces/JwtPayload';

export const ACCESS_TOKEN = 'ACCESS_TOKEN'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
     readonly configService: ConfigService,
     private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      secretOrKey: configService.get<string>('jwt.access_secret'),
    });
  }

  private static extractJwt(req: RequestType): string | null {
    
    if ( req.cookies && ACCESS_TOKEN in req.cookies && req.cookies.ACCESS_TOKEN?.length > 0 ) {
      return req.cookies.ACCESS_TOKEN
    }

    return null
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload

    const user = await this.userService.findUser({
      id: sub
    })

    if (!user) throw new UnauthorizedException('Token no valid')
    return user ;
  }
}