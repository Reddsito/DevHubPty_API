import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenGuard } from './guards/jwt_resfresh.guard';
import { GetUser } from './decorators/get-user.decorator';
import { Request as RequestType, Response as ResponseType } from 'express';
import { RefreshPayload } from './interfaces/refreshPayload.interface';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ForgotPasswordDto } from './dto/forgotPasword.dto';
import { User } from '../users/entities/user.entity';
import { GoogleGuard } from './guards/google.guard';
import { JwtAccessAuthGuard } from './guards/jwt_access.guard';
import { GoogleUser } from './interfaces/googleUser.interace';
import { GithubGuard } from './guards/github.guard';
import { GithubUser } from './interfaces/githubUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signIn')
  @HttpCode(200)
  async signIn(@Body() loginUserDTO: LoginUserDto,  @Res({ passthrough: true }) response: ResponseType) {
    return this.authService.signIn(loginUserDTO, response);
  }

  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: ResponseType ) {
    return this.authService.signUp(createUserDto, response);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Get('github')
  @UseGuards(GithubGuard)
  githubLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  googleLoginCallback(
    @GetUser() user:  GoogleUser,
    @Res() response: ResponseType,
    @Req() request: RequestType
  ) {
    return this.authService.googleCallback(user, response, request)
  }

  @Get('github/callback')
  @UseGuards(GithubGuard)
  githubCallback(
    @GetUser() user:  GithubUser,
    @Res() response: ResponseType,
    @Req() request: RequestType
  ) {
    return this.authService.githubCallback(user, response, request)
  }


  @Get('logout')
  @UseGuards(JwtAccessAuthGuard)
    async logout( @Res({ passthrough: true }) response: ResponseType  ) {
      return this.authService.logout(response)
    }

  @Get('verifyEmail/:id')
    async verifyEmail( @Param('id', ParseUUIDPipe) id: string) {
      return this.authService.verifyEmail(id)
    }

  @Post('changePassword/:id')
  @UseGuards(JwtAccessAuthGuard)
    async changePasswordPassword( 
      @Param('id', ParseUUIDPipe) id: string,
      @GetUser() user: User ) {
      return this.authService.createChangePasswordToken(id, user.id)
    }
  
  @Post('forgotPassword')
    async forgotPassword( @Body() forgotPasswordDto: ForgotPasswordDto ) {
      return this.authService.createForgotPasswordToken(forgotPasswordDto.email)
    }

  @Post('updatePassword')
  async updatePassword( @Body() updatePasswordDto: UpdatePasswordDto ) {
    return this.authService.updatePassword(updatePasswordDto.token, updatePasswordDto.password)
  }

  @Get('refresh')
  @UseGuards( RefreshTokenGuard )
  refreshToken(
    @GetUser() refreshPayload: RefreshPayload,
    @Res({ passthrough: true }) response: ResponseType 
  ) {
    return this.authService.refreshTokens(refreshPayload.sub, response);
  }


}
