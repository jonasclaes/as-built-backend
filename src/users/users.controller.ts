import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':uid')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('uid') uid: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.userService.updateUser(uid, updateUserDto);
  }
}
