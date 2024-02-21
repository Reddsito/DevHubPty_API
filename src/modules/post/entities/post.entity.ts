import { Post as PostDB } from '@prisma-mongo/prisma/client';


export class Post {

  id: PostDB['id']
  name: PostDB['name']
  authorId: PostDB['authorId']
  state : PostDB['state']
  data : PostDB['data']

}
