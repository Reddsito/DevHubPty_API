import { Status } from '@prisma-mongo/prisma/client';
import { IsEnum, IsJSON, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { Transform, Type } from 'class-transformer';



export class CreatePostDto {

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string

  @IsString()
  @IsUUID()
  authorId: string

  @IsEnum(Status)
  state?: Status

  @Type(() => Object)
  @Transform(value => value, { toClassOnly: true })
  data: Record<string, any>;

}
