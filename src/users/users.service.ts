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
      password: {
        password: 'defaultPassword123.',
        changeRequired: true,
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
        `https://as-built-g0qzjy.us1.zitadel.cloud/v2/users/human/${uid}`,
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

  async requestPasswordReset(uid: string): Promise<string> {
    const serviceUserToken = this.configService.get<string>(
      'ZITADEL_SERVICE_USER_TOKEN',
    );

    const payload = {
      returnCode: {},
    };

    try {
      const response = await axios.post(
        `https://as-built-g0qzjy.us1.zitadel.cloud/v2/users/${uid}/password_reset`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${serviceUserToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Password reset response:', response.data);
      const verificationCode = response.data?.verificationCode;
      if (!verificationCode) {
        throw new Error('No verification code returned');
      }

      return verificationCode;
    } catch (error) {
      if (error.response) {
        console.error('API call error:', error.response.data);
        throw new Error(
          `Failed to request password reset: ${error.response.data.message || 'Unknown error'}`,
        );
      }
      console.error('Error:', error.message);
      throw new Error('Failed to request password reset');
    }
  }

  async changeUserPassword(
    uid: string,
    password: string,
    currentPassword: string,
    verificationCode: string,
  ) {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) {
      throw new Error('User not found in the local database');
    }

    const payload = {
      newPassword: {
        password: password,
        changeRequired: true,
      },
      ...(verificationCode && { verificationCode }),
      ...(currentPassword && !verificationCode && { currentPassword }),
    };

    try {
      const response = await axios.post(
        `https://as-built-g0qzjy.us1.zitadel.cloud/v2/users/${uid}/password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('ZITADEL_SERVICE_USER_TOKEN')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API call error:', error.response.data);
        throw new Error(
          `Failed to change password: ${error.response.data.message || 'Unknown error'}`,
        );
      }
      console.error('Error:', error.message);
      throw new Error('Failed to update password in ZITADEL API');
    }
  }
}
