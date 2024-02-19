import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class ForgotPasswordDto {

  @IsString()  
  @IsEmail()
  email: string

}
