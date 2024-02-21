import { Status } from '@prisma-mongo/prisma/client';
import { IsEnum, IsJSON, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';


export class CreatePostDto {

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string

  @IsString()
  @IsUUID()
  authorId: string

  @IsEnum(Status)
  state: Status

  @IsJSON()
  data: Object


}
