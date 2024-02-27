import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentVotesService } from './comment-votes.service';
import { CreateCommentVoteDto } from './dto/create-comment-vote.dto';
import { UpdateCommentVoteDto } from './dto/update-comment-vote.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Auth(Role.USER)
@Controller('comment-votes')
export class CommentVotesController {
  constructor(private readonly commentVotesService: CommentVotesService) {}

  @Post()
  create(@Body() createCommentVoteDto: CreateCommentVoteDto) {
    return this.commentVotesService.create(createCommentVoteDto);
  }

  @Delete(':commentId')
  remove(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @GetUser() user: User
     ) {
    return this.commentVotesService.remove(commentId, user.id);
  }
}
