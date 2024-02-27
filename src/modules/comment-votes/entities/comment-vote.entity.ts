import { CommentVote as CommentVoteDB } from "@prisma/client";


export class CommentVote { 

  id: CommentVoteDB['commentId']
  userId: CommentVoteDB['userId']

 }
