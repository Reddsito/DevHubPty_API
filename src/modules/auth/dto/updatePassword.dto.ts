import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class UpdatePasswordDto {

  @IsString()  
  token: string

  @MinLength(8)
  @MaxLength(150)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
  password: string
}
