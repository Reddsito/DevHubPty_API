import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { MongoIdValidationPipe } from '../shared/pipes/mongo-id-validation.pipe';

@Auth(Role.USER)
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(
    @Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Delete(':id')
  remove(
    @Param('id', MongoIdValidationPipe) postId: string,
    @GetUser() user: User) {
    return this.votesService.remove(postId, user.id);
  }

  @Get(':id')
  getUserVote() {
    return this.votesService.getUserVotes()
  }
}
