import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { Request as RequestType } from "express";
import { JwtPayload } from "../interfaces/JwtPayload";

export const REFRESH_TOKEN = 'REFRESH_TOKEN'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor(
    readonly configService: ConfigService
  ){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get<string>('jwt.refresh_secret')
    })
  }

  private static extractJwt(req: RequestType): string | null {
    
    if ( req.cookies && REFRESH_TOKEN in req.cookies && req.cookies.REFRESH_TOKEN?.length > 0 ) {
      return req.cookies.REFRESH_TOKEN
    }

    return null
  }
  
  async validate(
    req: RequestType,
    payload: JwtPayload
  ) {

    const refreshToken = req.cookies.REFRESH_TOKEN 
    return {
      ...payload,
      refreshToken
    }
  }
}