import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZitadelApiService } from './zitadel-api.service';

@Controller('users')
export class UsersController {
  constructor(private readonly zitadelApiService: ZitadelApiService) {}

  @UseGuards(AuthGuard('zitadel'))
  @Post('create-human')
  async createHumanUser(
    @Headers('Authorization') authHeader: string,
    @Body() userPayload: Record<string, any>, // Adjust payload type
  ) {
    const accessToken = authHeader?.split(' ')[1]; // Extract Bearer token
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    return this.zitadelApiService.createHumanUser(accessToken, userPayload);
  }
}
