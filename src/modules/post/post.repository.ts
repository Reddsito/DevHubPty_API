import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma-mongo/prisma/client';
import { PrismaMongoService } from "../shared/database/prisma-mongo.service";


@Injectable()
export class PostRepository {

  constructor(
    private readonly prisma: PrismaMongoService
  ){}

  async create( params: {
    data: Prisma.PostCreateInput
    } ) 
  {
    const { data } = params
    return await this.prisma.post.create({
      data
    })
  }

  async find( params: {
    where: Prisma.PostWhereUniqueInput
    } ) 
  {
    const { where } = params
    return await this.prisma.post.findUnique({
      where
    })
  }

  async findOne( params: {
    where: Prisma.PostWhereInput
    } ) 
  {
    const { where } = params
    return await this.prisma.post.findFirst({
      where
    })
  }

  async findAll( params: {
    where: Prisma.PostWhereInput
    orderBy: Prisma.PostOrderByWithAggregationInput,
    skip: number,
    take: number,
    cursor: Prisma.PostWhereUniqueInput
    } ) 
  {
    const { where, cursor, orderBy, skip, take } = params
    return await this.prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
      cursor
    })
  }

  async update( params: {
    id: string,
    data: Prisma.PostUpdateInput
    } ) 
  {
    const { id, data } = params
    return await this.prisma.post.update({
      where: {
        id
      },
      data
    })
  }

  async delete(
    params: {
      id: string
    } ) 
  {
    const { id } = params
    return await this.prisma.post.delete({
      where: {
        id
      }
    })
    
  }

}