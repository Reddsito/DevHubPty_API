import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {

  @IsString()
  @IsUUID()
  authorId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  text: string;
}
