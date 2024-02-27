import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesRepository } from './votes.repository';
import { UserService } from '../users/user.service';

@Injectable()
export class VotesService {

  constructor(
    private readonly votesRepository: VotesRepository,
    private readonly userService: UserService
  )
  {}

  async create(createVoteDto: CreateVoteDto) {

    const vote = await this.find(createVoteDto.postId, createVoteDto.userId)

    if ( vote ) throw new ConflictException('This vote already exists')

    const user = await this.userService.find({
      id: createVoteDto.userId
    })

    if ( !user ) throw new NotFoundException(` Don't exist a user with this ID `)

    return await this.votesRepository.create({
      data: {
        ...createVoteDto
      }
    })
  }

  async find( postId: string, userId: string ){
    return await this.votesRepository.find({
      postId,
      userId
    })
  }

  async remove(postId: string, userId: string) {

    const vote = await this.find(postId, userId)

    if ( !vote ) throw new NotFoundException('This vote does not exist')

  return await this.votesRepository.delete({
    postId,
    userId
  })
  }

  async getVotesCountsForPosts(postIds: string[]) {
    const promises = postIds.map(postId => this.votesRepository.countVotesForPost(postId));
    const votesCounts = await Promise.all(promises);

    const result = {};
    postIds.forEach((postId, index) => {
      result[postId] = votesCounts[index];
    });

    return result;
  }

  async getUserVotes() {
    console.log('User votes')
  }
}
