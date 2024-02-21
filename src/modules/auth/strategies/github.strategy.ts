import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    readonly configService: ConfigService
  ) {

    const host = configService.get<string>('host')

    super({
      clientID: configService.get<string>('github.id'),
      clientSecret: configService.get<string>('github.secret'),
      callbackURL: `http://${ host }/api/v1/auth/github/callback`,
      scope: ['email', 'user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { displayName, username, emails, photos } = profile;

    const user = {
      photo: photos[0].value,
      email: emails[0].value,
      displayName,
      username,
    };

    done(null, user);

  }
}