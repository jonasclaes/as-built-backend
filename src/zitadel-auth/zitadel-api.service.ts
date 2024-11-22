import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZitadelApiService {
  private readonly zitadelBaseUrl: string;

  constructor() {
    // Replace with your Zitadel custom domain
    this.zitadelBaseUrl = 'https://your-custom-domain/v2'; // Update this URL
  }

  async createHumanUser(
    accessToken: string,
    userPayload: Record<string, any>, // Adjust as per the Zitadel API payload schema
  ): Promise<any> {
    try {
      // Make a request to the Zitadel API to create the human user
      const response = await axios.post(
        `${this.zitadelBaseUrl}/users/human`,
        userPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error creating Zitadel user:', error.response?.data || error.message);
      throw error; // Re-throw the error for further handling
    }
  }
}
