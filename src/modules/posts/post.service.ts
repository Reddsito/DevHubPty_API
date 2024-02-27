import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { SearchParamsDto } from './dto/searchParam.dto';
import { VotesService } from '../votes/votes.service';
import { Status } from '@prisma-mongo/prisma/client';

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
          has: searchParams.tag,
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

  async findAllArchivedPosts(searchParams: SearchParamsDto, postIds: string[]) {
    const { page, limit, tag } = searchParams;

    if (postIds.length <= 0) return []
  
    let whereClause = {
      
    };
  
    if (tag) {
      whereClause = {
        ...whereClause,
        state: Status.PUBLISH,
        tags: {
          has: tag,
        },
      };
    }
  
    if (postIds && postIds.length > 0) {
      whereClause = {
        ...whereClause,
        state: Status.PUBLISH,
        id: {
          in: postIds,
        },
      };
    }
  
    const posts = await this.postRepository.findAll({
      page,
      perPage: limit,
      where: whereClause,
    });
  
    return posts;
  }

  

  async findOne(id: string) {
    return this.postRepository.find({
      where: {
        id
      } 
    })
  }

  async update(id: string, updatePostDto: UpdatePostDto) {

    const post = await this.postRepository.find({
      where: {
        id
      }
    })

    if ( !post ) throw new NotFoundException(` Don't exist a post with this ID `)

    return this.postRepository.update({
      data: {
        ...updatePostDto
      },
      id
    });
  }

  async remove(id: string, user: string) {

    if ( id !== user ) throw new ForbiddenException(`You don't have a permission to delete this user`)

    const post = await this.postRepository.find({
      where: {
        id
      }
    })

    if ( !post ) throw new NotFoundException(` Don't exist a post with this ID `)

    return this.postRepository.delete({
      id
    });
  }
}
