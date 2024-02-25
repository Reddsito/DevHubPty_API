import { Vote as VoteDB } from "@prisma/client";


export class Vote {
  userId: VoteDB['userId']
  postId: VoteDB['postId']
}
