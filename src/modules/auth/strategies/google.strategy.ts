import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    readonly configService: ConfigService
  ) {

    const host = configService.get<string>('host')

    super({
      clientID: configService.get<string>('google.id'),
      clientSecret: configService.get<string>('google.secret'),
      callbackURL: `http://${ host }/api/v1/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      _accessToken,
      _refreshToken,
    };
    done(null, user);
  }
}