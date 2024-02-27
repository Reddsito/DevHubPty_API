import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivedPostDto } from './dto/create-archived-post.dto';
import { ArchivedPostsRepository } from './archived-posts.repostiory';
import { UserService } from '../users/user.service';
import { PostService } from '../posts/post.service';
import { SearchParamsDto } from '../posts/dto/searchParam.dto';

@Injectable()
export class ArchivedPostsService {

  constructor(
    private readonly archivedPostsRepository: ArchivedPostsRepository,
    private readonly userService: UserService,
    private readonly postService: PostService
  )
  {}

  async create(createArchivedPostDto: CreateArchivedPostDto) {

    const vote = await this.find(createArchivedPostDto.postId, createArchivedPostDto.userId)

    if ( vote ) throw new ConflictException('This post archived already exists')

    const user = await this.userService.find({
      id: createArchivedPostDto.userId
    })

    if ( !user ) throw new NotFoundException(` Don't exist a user with this ID `)

    return await this.archivedPostsRepository.create({
      data: {
        ...createArchivedPostDto
      }
    })
  }

  async find( postId: string, userId: string ){
    return await this.archivedPostsRepository.find({
      postId,
      userId
    })
  }

  async findAll(searchParams: SearchParamsDto, userId: string){

    const archivedPosts = await this.archivedPostsRepository.findAll({
      where: {
        userId
      },
    })

    const postsId = archivedPosts.map( post => {
      return post.postId
    } )

    return await this.postService.findAllArchivedPosts(searchParams, postsId)
  
  }

  async remove(postId: string, userId: string) {

    const vote = await this.find(postId, userId)

    if ( !vote ) throw new NotFoundException('This archived post does not exist')

    return await this.archivedPostsRepository.delete({
      postId,
      userId
    })
  }
}
