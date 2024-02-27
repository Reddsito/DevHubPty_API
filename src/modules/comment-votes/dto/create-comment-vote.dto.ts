import { IsOptional, IsString, IsUUID } from "class-validator"

export class CreateCommentVoteDto {

  @IsString()
  @IsUUID()
  userId: string

  @IsString()
  @IsUUID()
  commentId: string
}
