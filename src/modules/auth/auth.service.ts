import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'
import { Provider } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType, Response as ResponseType } from 'express';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/JwtPayload.interface';
import { ACCESS_TOKEN } from './strategies/access_jwt.strategy';
import { REFRESH_TOKEN } from './strategies/refresh-jwt.stategy';
import { TypedEventEmitter } from 'src/event-mitter/typed-event-emitter.class';
import { GoogleUser } from './interfaces/googleUser.interace';
import { GithubUser } from './interfaces/githubUser.interface';




@Injectable()
export class AuthService {

  refreshExpiration: number
  accessExpiration: number

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: TypedEventEmitter
  ) { 
    this.refreshExpiration = this.configService.get<number>('jwt.refresh_expiration')
    this.accessExpiration = this.configService.get<number>('jwt.access_expiration')
  }

  async signUp(createUserDto: CreateUserDto, response: ResponseType) {

    const user = await this.userService.find({
      email: createUserDto.email
    });

    if (user) throw new BadRequestException('A user with this email already exists.')

    const newUser = await this.userService.create({ ...createUserDto });
    const tokens = await this.getTokens({ sub: newUser.id, email: newUser.email, role: newUser.role })

    response.cookie(ACCESS_TOKEN, tokens.accessToken, { expires: new Date(Date.now() + this.accessExpiration), httpOnly: true })
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + this.refreshExpiration), httpOnly: true })

    const { password, ...rest } = newUser
    const host = this.configService.get<string>('host')
    const link = `http://${host}/api/v1/auth/verifyEmail/${newUser.id}`

    this.eventEmitter.emit('user.verifyEmail', {
      name: createUserDto.fullname,
      email: createUserDto.email,
      link: link
    })

    return {
      ...rest
    }
  }

  async signIn(loginUserDto: LoginUserDto, response: ResponseType) {
    const { email, password } = loginUserDto

    const user = await this.userService.find({
      email
    });

    if (!user) throw new UnauthorizedException('Password or email invalid')

    if (user.provider !== Provider.CREDENTIALS) throw new BadRequestException(`You can't access via credentials, use your login method.`)

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) throw new UnauthorizedException('Password or email invalid')

    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role })

    response.cookie(ACCESS_TOKEN, tokens.accessToken, { expires: new Date(Date.now() + this.accessExpiration), httpOnly: true })
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + this.refreshExpiration), httpOnly: true })

    const { password: pass, ...rest } = user;

    return {
      ...rest
    }
  }

  async googleCallback(userGoogle: GoogleUser, response: ResponseType, request: RequestType) {

    const { email, firstName, lastName, picture } = userGoogle;
    const fullname = `${firstName} ${lastName ? lastName : ''}`;
    const username = `${firstName}${lastName ? lastName : ''}_${nanoid(5)}`;

    let user = await this.userService.find({ email });

    if (!user) {
      const createUserDto: CreateUserDto = {
        email,
        fullname,
        username,
        password: '',
        verifyEmail: true,
        photo: picture,
        provider: Provider.GOOGLE
      };
      user = await this.userService.create({ ...createUserDto });
    }

    const { password: userPassword = null, ...restUser } = user; 
    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role });


    response.cookie(ACCESS_TOKEN, tokens.accessToken, { expires: new Date(Date.now() + this.accessExpiration), httpOnly: true });
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + this.refreshExpiration), httpOnly: true });

    response.json({
      status: true,
      path: request.url,
      statusCode: 200,
      result: restUser,
    });

  }

  async githubCallback(githubUser: GithubUser, response: ResponseType, request: RequestType) {

    const { email, displayName, photo, username } = githubUser;

    console.log(githubUser)


    let user = await this.userService.find({ email });

    if (!user) {
      const createUserDto: CreateUserDto = {
        email,
        fullname: displayName,
        username,
        password: '',
        verifyEmail: true,
        photo,
        provider: Provider.GITHUB
      };
      user = await this.userService.create({ ...createUserDto });
    }

    const { password: userPassword = null, ...restUser } = user; 
    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role });


    response.cookie(ACCESS_TOKEN, tokens.accessToken, { expires: new Date(Date.now() + this.accessExpiration), httpOnly: true });
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + this.refreshExpiration), httpOnly: true });

    response.json({
      status: true,
      path: request.url,
      statusCode: 200,
      result: restUser,
    });

  }

  private async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          secret: this.configService.get<string>('jwt.access_secret'),
          expiresIn: '6h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          secret: this.configService.get<string>('jwt.refresh_secret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshTokens(userId: string, response: ResponseType) {

    const user = await this.userService.find({
      id: userId
    });

    if (!user) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role })
    response.cookie(ACCESS_TOKEN, tokens.accessToken, { expires: new Date(Date.now() + this.accessExpiration), httpOnly: true })
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + this.refreshExpiration), httpOnly: true })

  }

  async createChangePasswordToken(id: string, userId: string) {

    if (id !== userId) throw new ForbiddenException(`You don't have a permission to create Password Token to another user`)


    const user = await this.userService.find({
      id
    })

    if (!user) throw new BadRequestException(`Don't exist a user with this email `)

    const token = nanoid(20);

    await this.userService.update(user.id, { id: user.id, verifyToken: token })

    const link = `http://${this.configService.get<string>('host')}/api/v1/auth/changePassword/${token}`

    this.eventEmitter.emit('user.forgotPassword', {
      email: user.email,
      name: user.fullname,
      link
    })

  }

  async createForgotPasswordToken(email: string) {

    const user = await this.userService.find({
      email
    })

    if (!user) throw new BadRequestException(`Don't exist a user with this email `)

    const token = nanoid(20);

    await this.userService.update(user.id, { id: user.id, verifyToken: token })

    const link = `http://${this.configService.get<string>('host')}/api/v1/auth/forgotPassword/${token}`

    this.eventEmitter.emit('user.changePassword', {
      email,
      name: user.fullname,
      link
    })

  }

  async updatePassword(verifyToken: string, password: string) {

    const user = await this.userService.findBy({
      verifyToken
    })


    if (!user) throw new BadRequestException(`Don't exist a user with this token, invalid request`)

    const newUser = await this.userService.update(user.id, { id: user.id, verifyToken: null, password: bcrypt.hashSync(password, 10) })

    return {
      ...newUser
    };

  }

  logout(response: ResponseType) {
    response.cookie(ACCESS_TOKEN, { expires: new Date(Date.now()), httpOnly: true })
    response.cookie(REFRESH_TOKEN, { expires: new Date(Date.now()), httpOnly: true })
  }

  async verifyEmail(id: string) {

    const user = await this.userService.find({
      id
    })

    if ( !user ) throw new BadRequestException(`A user with this email don't exists.`)

    this.userService.update(id, { verifyEmail: true, id })

  }

}
