import { IsMongoId, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateCommentDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  text: string

  @IsString()
  @IsUUID()
  authorId: string

  @IsMongoId()
  postId: string

  @IsUUID()
  @IsOptional()
  replyToAuthorId?: string

  @IsUUID()
  @IsOptional()
  @IsString()
  id?: string

}
