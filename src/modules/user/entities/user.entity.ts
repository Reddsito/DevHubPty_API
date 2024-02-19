import { User as UserDB} from "@prisma/client"

export class User {

  id: UserDB['id']
  fullname: UserDB['fullname']
  username: UserDB['username']
  email: UserDB['email']
  password: UserDB['password']
  provider: UserDB['provider']
  verfiyEmail: UserDB['verifyEmail']
  verifyToken: UserDB['verifyToken']
  biography: UserDB['biography']
  role: UserDB['role']

}
