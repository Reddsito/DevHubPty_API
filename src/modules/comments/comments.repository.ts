import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/database/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class CommentsRepository {

  constructor(
    private readonly prisma: PrismaService
  ){}

  async create( params: {
    data: Prisma.CommentCreateInput
  } ) {

    const { data } = params
    return await this.prisma.comment.create({
      data
    })
  }

  async findCommentReplies( params: {
    where: Prisma.CommentWhereUniqueInput
  } ) {
    const { where } = params
    const comments = await this.prisma.comment.findUnique({
      where,
      select: {
        replies: {
          select:{
            author: {
              select:{
                photo: true,
                id: true,
                username: true,
              }
            },
            createdAt: true,
            id: true,
            postId: true,
            text: true,
            replyToAuthorId: true,
            votes: true,
            replies: true
          }
        },
      }
    })

    const commentsWithCount = comments.replies.map(comment => ({
      ...comment,
      votes: comment.votes.length,
      replies: comment.replies.length
    }));
  
    return commentsWithCount;
  }

  async find( params: {
    where: Prisma.CommentWhereUniqueInput
  } ) {
    const { where } = params
    return await this.prisma.comment.findUnique({
      where
    })
  }

  async findPostComments( params: {
    where: Prisma.CommentWhereInput 
  } ) {
    const { where } = params
    const comments = await this.prisma.comment.findMany({
      where: {
          AND: [
              where,
              {
                  replyToAuthorId: null 
              }
          ]
      },
      select: {
        author: {
          select:{
            photo: true,
            id: true,
            username: true,
          }
        },
        createdAt: true,
        id: true,
        postId: true,
        text: true,
        votes: true,
        replies: true
      }
    })

    const commentsWithCount = comments.map(comment => ({
      ...comment,
      votes: comment.votes.length,
      replies: comment.replies.length
    }));
  
    return commentsWithCount;
  }

  async update( params: {
    id: string,
    data: Prisma.CommentUpdateInput
  } ){
    const { id, data } = params
    return await this.prisma.comment.update({
      where: {
        id
      },
      data
    })
  }

  async delete( params: {
    id: string
  } ){
    const { id } = params
    await this.prisma.comment.delete({
      where: {
        id
      }
    })
  }

}