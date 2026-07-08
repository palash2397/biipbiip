import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApiResponse } from 'src/helpers/ApiResponse';
import { generateOtp, getExpirationTime } from 'src/helpers/index';

import { Msg } from 'src/helpers/responseMsg';

import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async myProfile(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-otp -otpExpireAt');

      if (!user) {
        return new ApiResponse(400, {}, Msg.USER_NOT_FOUND);
      }

      return new ApiResponse(200, user, Msg.USER_FETCHED);
    } catch (error) {
      console.log('error while getting my profile', error);

      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
