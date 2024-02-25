import { IsMongoId, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateVoteDto {

  @IsString()
  @IsUUID()
  @IsOptional()
  userId?: string

  @IsString()
  @IsMongoId()
  postId: string

}
