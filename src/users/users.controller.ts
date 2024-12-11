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
import { UpdateUserDto } from './dto/update-user.dto';

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
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(uid, updateUserDto);
  }
}
