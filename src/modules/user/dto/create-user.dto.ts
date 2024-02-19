import { Provider } from "@prisma/client"
import { IsBoolean, IsEmail, IsEnum, IsOptional, Matches, MaxLength, MinLength,  } from "class-validator"



export class CreateUserDto {

  @MinLength(2)
  @MaxLength(50)
  fullname: string

  @MinLength(2)
  @MaxLength(30)
  username: string

  @IsEmail()
  email: string

  @MinLength(8)
  @MaxLength(150)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
  password: string

  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider 

  @IsBoolean()
  @IsOptional()
  verifyEmail?: boolean 
  
}
