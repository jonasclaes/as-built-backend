import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  url = this.configService.getOrThrow<string>('IDP_AUTHORITY');

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
      const response = await axios.post(`${this.url}/v2/users/human`, payload, {
        headers: {
          Authorization: `Bearer ${serviceUserToken}`,
          'Content-Type': 'application/json',
        },
      });

      const { userId } = response.data;

      const user = this.userRepository.create({ uid: userId });
      return await this.userRepository.save(user);
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

  async updateUser(uid: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) {
      throw new Error('User not found in the local database');
    }

    const { givenName, familyName, email } = updateUserDto;
    const payload = {
      username: `${email}`,
      profile: {
        givenName,
        familyName,
        displayName: `${givenName} ${familyName}`,
      },
      email: {
        email,
        isVerified: true,
      },
    };

    try {
      const response = await axios.put(
        `${this.url}/v2/users/human/${uid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'ZITADEL_SERVICE_USER_TOKEN',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'API call error:',
        error.response ? error.response.data : error.message,
      );
      throw new Error(
        error.response?.data?.message || 'Failed to update user in ZITADEL API',
      );
    }
  }
}
