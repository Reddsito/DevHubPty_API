import { IsMongoId, IsString, IsUUID } from "class-validator"

export class CreateArchivedPostDto {
  @IsString()
  @IsUUID()
  userId: string

  @IsString()
  @IsMongoId()
  postId: string
}
