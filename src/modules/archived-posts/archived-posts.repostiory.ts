import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/database/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class ArchivedPostsRepository {


  constructor(
    private readonly prisma: PrismaService
  ){}

  async create( params: {
    data: Prisma.ArchivedPostCreateInput
  } ){

    const { data } = params
    return await this.prisma.archivedPost.create({
      data
    })

  }

  async find( params: {
    userId: string,
    postId: string
  } ) {
    const { userId, postId } = params
    return await this.prisma.archivedPost.findUnique({
      where: {
        userId_postId: {
          postId,
          userId
        }
      }
    })
  }

  async findAll( params: {
    where: Prisma.ArchivedPostWhereInput
  } ) {
    const { where } = params
    return await this.prisma.archivedPost.findMany({
      where,
      select: {
        postId: true
      }
    })
  }

  async delete( params: {
    userId: string,
    postId: string
  } ){

    const { userId, postId } = params
    return await this.prisma.archivedPost.delete({
      where: {
        userId_postId: {
          postId,
          userId
        }
      }
    })

  }

}