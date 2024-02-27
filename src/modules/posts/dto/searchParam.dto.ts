import { IsOptional, IsString } from "class-validator"

export class SearchParamsDto {

  @IsString()
  @IsOptional()
  page?: number

  @IsString()
  @IsOptional()
  limit?: number

  @IsString()
  @IsOptional()
  tag?: string
}