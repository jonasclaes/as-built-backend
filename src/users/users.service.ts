import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) {}

  async createUser(createUserDto: CreateUserDto): Promise<AxiosResponse> {
    const zitadelPat = this.configService.get<string>('ZITADEL_PAT');
    if (!zitadelPat) {
      throw new Error('ZITADEL_API_TOKEN is not set');
    }
    const { givenName, familyName, email } = createUserDto;
    const payload = {
      profile: {
        givenName,
        familyName,
      },
      email: {
        email,
        isVerified: true,
      },
    };

    try {
      const response = await axios.post(
        'https://as-built-g0qzjy.us1.zitadel.cloud/v2/users/human',
        payload,
        {
          headers: {
            Authorization: `Bearer ${zitadelPat}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'API call error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error(
        error.response?.data || 'Failed to create user in ZITADEL API',
      );
    }
  }
}
