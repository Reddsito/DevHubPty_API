import { Status } from '@prisma-mongo/prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsJSON, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, MaxLength, MinLength, } from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { IsNonEmptyObject } from '@/modules/shared/decorators/is-nom-empty-object.decorator';



export class CreatePostDto {

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string

  @IsString()
  @IsUUID()
  authorId: string

  @IsOptional()
  @IsEnum(Status)
  state?: Status

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags: string[]
  
  @IsObject()
  @IsNonEmptyObject()
  data: Record<string, any>;

}
