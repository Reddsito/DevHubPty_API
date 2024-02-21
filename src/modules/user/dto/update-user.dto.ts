import { Provider } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto  {

  @IsOptional()
  @IsUUID()
  @IsString()
  id?: string

  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  fullname?: string

  @IsOptional()
  @MinLength(2)
  @MaxLength(30)
  username?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsString()
  @IsOptional()
  photo?: string

  @IsOptional()
  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider

  @IsOptional()
  @IsBoolean()
  @IsOptional()
  verifyEmail?: boolean 

  @MinLength(8)
  @MaxLength(150)
  @IsOptional()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
  password?: string

  @IsOptional()
  verifyToken?: string 

  @IsOptional()
  @IsOptional()
  @MinLength(15)
  @MaxLength(150)
  biography?: string


}
