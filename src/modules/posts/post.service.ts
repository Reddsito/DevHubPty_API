import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { SearchParamsDto } from './dto/searchParam.dto';
import { VotesRepository } from '../votes/votes.repository';
import { VotesService } from '../votes/votes.service';

@Injectable()
export class PostService {

  constructor(
    private readonly postRepository: PostRepository,
    private readonly votesService: VotesService
  ){}

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.create({
      data: {
        ...createPostDto
      }
    });
  }

  async findAll( searchParams: SearchParamsDto) {
    const posts = await this.postRepository.findAll({
      page: searchParams.page,
      perPage: searchParams.limit,
      where: searchParams.tag ? {
        tags: {
          has: searchParams.tag
        }
      } : {}
    });

    const postsIds = posts.data.map( post => post.id )
    const votesCounts  = await this.votesService.getVotesCountsForPosts(postsIds)

    const postsWithVotes = posts.data.map(post => {
      return {
        ...post,
        votes: votesCounts[post.id] || 0
      }
    });

    return {
      data: postsWithVotes,
      meta: posts.meta
    };

  }

  

  async findOne(id: string) {
    return this.postRepository.find({
      where: {
        id
      } 
    })
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepository.update({
      data: {
        ...updatePostDto
      },
      id
    });
  }

  async remove(id: string, user: string) {

    if ( id !== user ) throw new ForbiddenException(`You don't have a permission to delete this user`)

    return this.postRepository.delete({
      id
    });
  }
}
