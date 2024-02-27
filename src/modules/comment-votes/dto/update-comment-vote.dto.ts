import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentVoteDto } from './create-comment-vote.dto';

export class UpdateCommentVoteDto extends PartialType(CreateCommentVoteDto) {}
