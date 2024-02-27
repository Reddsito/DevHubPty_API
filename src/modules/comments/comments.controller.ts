import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MongoIdValidationPipe } from '../shared/pipes/mongo-id-validation.pipe';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Auth(Role.USER)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('post_comments/:postId')
  getPostComments(
    @Param('postId', MongoIdValidationPipe) postId: string
  ) {
    return this.commentsService.getPostComments(postId);
  }

  @Get('comment_replies/:commentId')
  getCommentReplies(@Param('commentId', ParseUUIDPipe) commentId: string) {
    return this.commentsService.getCommentReplies(commentId);
  }

  @Patch(':commentId')
  update(
    @Param('commentId', ParseUUIDPipe) commentId: string, 
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User) {
    return this.commentsService.update(commentId, updateCommentDto, user);
  }

  @Delete(':commentId')
  remove(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @GetUser() user: User) {
    return this.commentsService.remove(commentId, user.id);
  }
}
