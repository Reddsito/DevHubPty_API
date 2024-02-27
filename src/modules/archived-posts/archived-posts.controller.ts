import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArchivedPostsService } from './archived-posts.service';
import { CreateArchivedPostDto } from './dto/create-archived-post.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { SearchParamsDto } from '../posts/dto/searchParam.dto';
import { MongoIdValidationPipe } from '../shared/pipes/mongo-id-validation.pipe';


@Auth(Role.USER)
@Controller('archived-posts')
export class ArchivedPostsController {
  constructor(private readonly archivedPostsService: ArchivedPostsService) {}

  @Post()
  create(@Body() createArchivedPostDto: CreateArchivedPostDto) {
    return this.archivedPostsService.create(createArchivedPostDto);
  }

  @Get()
  findAll(
    @Query() searchParamsDto: SearchParamsDto,
    @GetUser() user: User
  ) {
    return this.archivedPostsService.findAll(searchParamsDto, user.id);
  }

  @Delete(':postId')
  remove(
    @Param('postId', MongoIdValidationPipe) postId: string,
    @GetUser() user: User) {
    return this.archivedPostsService.remove(postId, user.id);
  }
}
