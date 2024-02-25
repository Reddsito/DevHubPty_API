import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/database/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class VotesRepository {
  
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create( params: {
    data: Prisma.VoteCreateInput
  } ){

    const { data } = params
    return await this.prisma.vote.create({
      data
    })

  }

  
  async find( params: {
    userId: string,
    postId: string
  } ) {
    const { userId, postId } = params
    return await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          postId,
          userId
        }
      }
    })
  }

  async delete( params: {
    userId: string,
    postId: string
  } ){

    const { userId, postId } = params
    return await this.prisma.vote.delete({
      where: {
        userId_postId: {
          postId,
          userId
        }
      }
    })

  }

  async countVotesForPost(postId: string) {
    return await this.prisma.vote.count({
      where: {
        postId: postId
      }
    });
  }

}