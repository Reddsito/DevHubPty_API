import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma-mongo/prisma/client';
import { PrismaMongoService } from "../shared/database/prisma-mongo.service";
import { PaginateFunction, PaginatedResult, paginator } from "../shared/paginator";
import { Post } from "./entities/post.entity";


const paginate: PaginateFunction = paginator({ perPage: 10 });


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
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithAggregationInput,
    page?: number
    perPage?: number
    } ): Promise<PaginatedResult<Post>> 
  {
    const { where, orderBy, page, perPage } = params
    return paginate(
      this.prisma.post,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage
      }
    )
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