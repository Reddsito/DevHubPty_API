import { IsEmail, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator"

export class ChangePasswordDto {

  @IsString()  
  @IsUUID()
  id: string

}
