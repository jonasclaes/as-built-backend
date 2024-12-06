import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const serviceUserToken = this.configService.get<string>(
      'ZITADEL_SERVICE_USER_TOKEN',
    );

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
            Authorization: `Bearer ${serviceUserToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const { userId } = response.data;

      const user = new User();
      user.uid = userId;
      await this.userRepository.save(user);
      return user;
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
