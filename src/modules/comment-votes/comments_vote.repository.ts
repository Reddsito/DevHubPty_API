import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/database/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class CommentsVoteRepository {


  constructor(
    private readonly prisma: PrismaService
  ){}

  async create( params: {
    data: {
      userId: string,
      commentId: string
    }
  } ){

    const { data } = params
    return await this.prisma.commentVote.create({
      data
    })

  }

  
  async find( params: {
    userId: string,
    commentId: string
  } ) {
    const { userId, commentId } = params
    return await this.prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          commentId,
          userId
        }
      }
    })
  }

  async delete( params: {
    userId: string,
    commentId: string
  } ){

    const { userId, commentId } = params
    return await this.prisma.commentVote.delete({
      where: {
        userId_commentId: {
          commentId,
          userId
        }
      }
    })

  }

}