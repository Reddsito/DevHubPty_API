import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'
import { Provider } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Response as ResponseType } from 'express';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/JwtPayload';
import { ACCESS_TOKEN } from './strategies/access_jwt.strategy';
import { REFRESH_TOKEN } from './strategies/refresh-jwt.stategy';
import { TypedEventEmitter } from 'src/event-mitter/typed-event-emitter.class';




@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: TypedEventEmitter
  ) { }

  async signUp(createUserDto: CreateUserDto, response: ResponseType) {

    const user = await this.userService.findUser({
      email: createUserDto.email
    });

    if ( user ) throw new BadRequestException('A user with this email already exists.')

    const newUser = await this.userService.create({ ...createUserDto });
    const tokens = await this.getTokens({ sub: newUser.id, email: newUser.email, role: newUser.role })
    
    response.cookie(ACCESS_TOKEN, tokens.accessToken,{ expires: new Date(Date.now() + (6 * 60 * 60 * 1000)), httpOnly: true } )
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), httpOnly: true })
  
    const { password, ...rest } = newUser
    const host = this.configService.get<string>('host')
    const link = `http://${ host }/api/v1/auth/verifyEmail/${ newUser.id }`

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

    const user = await this.userService.findUser({
      email
    });

    if ( user.provider !== Provider.CREDENTIALS ) throw new BadRequestException(`You can't access via credentials, use your login method.`)

    if (!user) throw new UnauthorizedException('Password or email invalid')

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) throw new UnauthorizedException('Password or email invalid')

    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role })

    response.cookie(ACCESS_TOKEN, tokens.accessToken,{ expires: new Date(Date.now() + (6 * 60 * 60 * 1000)), httpOnly: true } )
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), httpOnly: true })

    const {password: pass, ...rest } = user;

    return {
        ...rest 
    }
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

    const user = await this.userService.findUser({
      id: userId
    });
    
    if (!user) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens({ sub: user.id, email: user.email, role: user.role })
    response.cookie(ACCESS_TOKEN, tokens.accessToken,{ expires: new Date(Date.now() + (6 * 60 * 60 * 1000)), httpOnly: true } )
    response.cookie(REFRESH_TOKEN, tokens.refreshToken, { expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), httpOnly: true })

  }

  async createChangePasswordToken( id: string, userId: string ) {

    if ( id !== userId ) throw new ForbiddenException(`You don't have a permission to create Password Token to another user`)


    const user = await this.userService.findUser({
      id
    })

    if ( !user ) throw new BadRequestException(`Don't exist a user with this email `)
    
    const token = nanoid(20);

    await this.userService.update( user.id, {id: user.id, verifyToken: token} )

    const link = `http://${ this.configService.get<string>('host') }/api/v1/auth/changePassword/${ token }`

    this.eventEmitter.emit('user.forgotPassword', {
      email: user.email,
      name: user.fullname,
      link
    })

  }

  async createForgotPasswordToken( email: string) {

    const user = await this.userService.findUser({
      email
    })

    if ( !user ) throw new BadRequestException(`Don't exist a user with this email `)
    
    const token = nanoid(20);

    await this.userService.update( user.id, {id: user.id, verifyToken: token} )

    const link = `http://${ this.configService.get<string>('host') }/api/v1/auth/forgotPassword/${ token }`

    this.eventEmitter.emit('user.changePassword', {
      email,
      name: user.fullname,
      link
    })

  }

  async updatePassword( verifyToken: string, password: string ) {
    
    const user = await this.userService.findUser({
      verifyToken
    })

    if ( !user ) throw new BadRequestException(`Don't exist a user with this token, invalid request`)

    const newUser = await this.userService.update(user.id, {id: user.id, verifyToken: null, password: bcrypt.hashSync(password, 10)})

    return newUser;

  }

  logout( response: ResponseType ) {
    response.cookie(ACCESS_TOKEN, { expires: new Date(Date.now()), httpOnly: true } )
    response.cookie(REFRESH_TOKEN, { expires: new Date(Date.now()), httpOnly: true })
  }

  async verifyEmail( id: string ) {
    
    await this.userService.findUser({
      id
    })

    this.userService.update(id, {verifyEmail: true, id})

  }

}
