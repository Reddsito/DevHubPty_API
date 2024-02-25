import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Auth(Role.USER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @GetUser() user: User) {

      console.log(user)

      updateUserDto.id = user.id
      return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User) {

    return this.userService.remove(id, user.id);
  }
}
