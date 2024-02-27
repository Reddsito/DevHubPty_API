import { PartialType } from '@nestjs/mapped-types';
import { CreateArchivedPostDto } from './create-archived-post.dto';

export class UpdateArchivedPostDto extends PartialType(CreateArchivedPostDto) {}
