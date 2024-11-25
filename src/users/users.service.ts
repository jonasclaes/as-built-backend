import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) {}

  async createUser(createUserDto: CreateUserDto): Promise<AxiosResponse> {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new Error(
        'Validation failed: ' +
          errors.map((error) => error.toString()).join(', '),
      );
    }

    const accessToken = await this.getAccessToken();

    const payload = {
      profile: {
        givenName: createUserDto.givenName,
        familyName: createUserDto.familyName,
      },
      email: {
        email: createUserDto.email,
        isVerified: true, // assuming email is verified for the example
      },
    };

    try {
      const response = await axios.post(
        'https://as-built-g0qzjy.us1.zitadel.cloud/management/v2/users/human',
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('OPENAPI_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'OPENAPI_CLIENT_SECRET',
    );

    if (!clientId || !clientSecret) {
      throw new Error('OPENAPI_CLIENT_ID or OPENAPI_CLIENT_SECRET is not set');
    }

    const response = await axios.post(
      'https://as-built-g0qzjy.us1.zitadel.cloud/oauth/v2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'openid profile email',
      }),
    );

    return response.data.access_token;
  }
}
