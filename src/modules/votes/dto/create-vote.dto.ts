import { IsMongoId, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateVoteDto {

  @IsString()
  @IsUUID()
  userId: string

  @IsString()
  @IsMongoId()
  postId: string

}
