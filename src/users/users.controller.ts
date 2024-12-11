import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':uid')
  async updateUser(
    @Param('uid') uid: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.userService.updateUser(uid, updateUserDto);
  }

  @Post('/:uid/reset-password')
  async requestPassWordReset(@Param('uid') uid: string) {
    return this.userService.requestPasswordReset(uid);
  }
}
