import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { PostService } from '../posts/post.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {

  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postService: PostService
  ) { }

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentsRepository.create({
      data: {
        ...createCommentDto
      }
    });
  }

  private async find(commentId: string) {
    return await this.commentsRepository.find({
      where: {
        id: commentId
      }
    })
  }

  async getPostComments(postId: string) {

    const post = await this.postService.findOne(postId)

    if (!post) throw new NotFoundException(`Don't exist a post with this id`)

    return await this.commentsRepository.findPostComments({
      where: {
        postId
      }
    });
  }

  async getCommentReplies(commentId: string) {

    const comment = await this.find(commentId)

    if ( !comment ) throw new NotFoundException(`Don't exist a comment with this ID`)

    return await this.commentsRepository.findCommentReplies({
      where: {
        id: commentId
      }
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {

    if (updateCommentDto.authorId !== user.id) {
      throw new ForbiddenException(`This user don't have permission to change another comment`)
    }

    const comment = await this.commentsRepository.find({
      where: {
        id
      }
    })

    if ( !comment ) throw new NotFoundException(`Don't exist comment with this ID`)

    return await this.commentsRepository.update({
      data: updateCommentDto,
      id
    }) ;
  }

  async remove(id: string, userId: string) {

    const comment = await this.find(id)
    if (!comment) throw new NotFoundException(`Don't exist a comment with this id`)

    if (userId !== comment.authorId) throw new ForbiddenException(`This user don't have permission to change another comment`)

    return await this.commentsRepository.delete({
      id
    });
  }
}
