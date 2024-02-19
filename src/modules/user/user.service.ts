import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import  * as bcrypt  from 'bcrypt'
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository
  ){}

  async create(createUserDto: CreateUserDto) {

    const { email, username, password } = createUserDto;

    const existingEmail  = await this.userRepository.find({
      where: {
        email
      }
    })    

    if ( existingEmail  ) throw new BadRequestException('There is already a user with this email')

    const existingUsername  = await this.userRepository.find({
      where: {
        username
      }
    })    

    if ( existingUsername ) throw new BadRequestException('There is already a user with this username')

    return this.userRepository.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(password, 10)
      }
    });
  }

  async findUser( where: Prisma.UserWhereInput  ) {

   return await this.userRepository.find({
      where
    })

  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    if ( id !== updateUserDto.id ) throw new ForbiddenException(`You don't have a permission to update another user's profile.`)

    const { username, email } = updateUserDto

    const existingEmail  = await this.userRepository.find({
      where: {
        email
      }
    })    

    if ( existingEmail  ) throw new BadRequestException('There is already a user with this email')

    const existingUsername  = await this.userRepository.find({
      where: {
        username
      }
    })    

    if ( existingUsername ) throw new BadRequestException('There is already a user with this username')

    return this.userRepository.updateUser({
      data: updateUserDto,
      id
    });
  }

  async remove(paramId: string, userId: string) {

    if ( paramId !== userId ) throw new ForbiddenException(`You don't have a permission to update another user's profile.`)


    const user = await this.userRepository.find({
      where: {
        id: paramId
      }
    })

    if ( !user ) throw new BadRequestException('There is not user with this id')

    return this.userRepository.deleteUser(paramId);
  }
}
