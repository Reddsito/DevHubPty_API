import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { SearchParamsDto } from './dto/searchParam.dto';
import { MongoIdValidationPipe } from '../shared/pipes/mongo-id-validation.pipe';

@Auth(Role.USER)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query() searchParamsDto: SearchParamsDto
  ) {
    return this.postService.findAll( searchParamsDto );
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(
    @Param('id', MongoIdValidationPipe) id: string,
    @GetUser() user: User) {
    return this.postService.remove(id, user.id);
  }
}
