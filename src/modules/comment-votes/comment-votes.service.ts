import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentVoteDto } from './dto/create-comment-vote.dto';
import { UpdateCommentVoteDto } from './dto/update-comment-vote.dto';
import { CommentsVoteRepository } from './comments_vote.repository';
import { UserService } from '../users/user.service';

@Injectable()
export class CommentVotesService {


  constructor(
    private readonly commentsVoteRepository: CommentsVoteRepository,
    private readonly userService: UserService
  ){}

  async create(createCommentVoteDto: CreateCommentVoteDto) {

    const vote = await this.find(createCommentVoteDto.commentId, createCommentVoteDto.userId)

    if ( vote ) throw new ConflictException('This vote already exists')

    const user = await this.userService.find({
      id: createCommentVoteDto.userId
    })

    if ( !user ) throw new NotFoundException(` Don't exist a user with this ID `)

    return await this.commentsVoteRepository.create({
      data: {
        ...createCommentVoteDto
      }
    })
  }

  async find( commentId: string, userId: string ){
    return await this.commentsVoteRepository.find({
      commentId,
      userId
    })
  }

  async remove(commentId: string, userId: string) {

    const vote = await this.find(commentId, userId)

    if ( !vote ) throw new NotFoundException('This vote does not exist')

  return await this.commentsVoteRepository.delete({
    commentId,
    userId
  })
  }
}
