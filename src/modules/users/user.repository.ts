import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../shared/database/prisma.service";


@Injectable()
export class UserRepository {
  
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create( params: {
    data: Prisma.UserCreateInput
  } ): Promise<User> {
    const { data } = params
    return await this.prisma.user.create({
      data
    })
  }

  async find( params: {
    where: Prisma.UserWhereUniqueInput
  } ): Promise<User> {

    const { where } = params

    return await this.prisma.user.findUnique({
      where
    })
  }

  async findBy( params: {
    where: Prisma.UserWhereInput
  } ): Promise<User> {

    const { where } = params

    return await this.prisma.user.findFirst({
      where
    })
  }



  async findAll(){
    return await this.prisma.user.findMany()
  }

  async updateUser(params: {
    id: string,
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { id, data } = params;
    return await this.prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id }
    });
  }
  

}