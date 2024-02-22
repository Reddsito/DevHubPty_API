import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConfigService } from '@nestjs/config';
import { PostRepository } from './post.repository';
import { SearchParamsDto } from './dto/searchParam.dto';

@Injectable()
export class PostService {

  constructor(
    private readonly postRepository: PostRepository
  ){}

  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.create({
      data: {
        ...createPostDto
      }
    });
  }

  async findAll( searchParams: SearchParamsDto) {
    return await this.postRepository.findAll({
      orderBy: { 
        ...searchParams.orderBy
       },
      page: searchParams.page,
      where: {
        ...searchParams.where
      }
    });
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
