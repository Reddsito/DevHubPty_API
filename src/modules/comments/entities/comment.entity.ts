import { Comment as CommentDB } from "@prisma/client";


export class Comment {

  id: CommentDB['id']
  text: CommentDB['text']
  createdAt: CommentDB['createdAt']
  authorId: CommentDB['authorId']
  postId: CommentDB['postId']
  replyToAuthorId: CommentDB['replyToAuthorId']
  
}
