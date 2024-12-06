import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';

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

  @Patch(':uid/password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: { type: 'string' },
        currentPassword: { type: 'string' },
      },
    },
  })
  async changePassword(
    @Param('uid') uid: string,
    @Body() body: { newPassword: string; currentPassword: string },
  ) {
    const { newPassword, currentPassword } = body;

    if (!newPassword || !currentPassword) {
      throw new BadRequestException(
        'Both newPassword and currentPassword are required',
      );
    }

    const verificationCode = await this.userService.requestPasswordReset(uid);
    return this.userService.changeUserPassword(
      uid,
      newPassword,
      currentPassword,
      verificationCode,
    );
  }
}
