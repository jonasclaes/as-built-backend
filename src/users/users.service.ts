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

  url = this.configService.getOrThrow<string>('IDP_AUTHORITY');
  serviceUserToken = this.configService.getOrThrow<string>(
    'ZITADEL_SERVICE_USER_TOKEN',
  );

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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
          Authorization: `Bearer ${this.serviceUserToken}`,
          'Content-Type': 'application/json',
        },
      });

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

  async updateUser(uid: string, updateUserDto: CreateUserDto) {
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
            Authorization: `Bearer ${this.serviceUserToken}`,
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

  async requestPasswordReset(uid: string) {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) {
      throw new Error('User not found in database');
    }
    const payload = {
      sendLink: {
        notificationType: 'NOTIFICATION_TYPE_Email',
      },
    };
    try {
      const response = await axios.post(
        `${this.url}/v2/users/${uid}/password_reset`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.serviceUserToken}`,
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
        error.response?.data || 'Failed to reset user password in ZITADEL API',
      );
    }
  }
}
