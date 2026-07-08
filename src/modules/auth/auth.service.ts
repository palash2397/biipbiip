import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApiResponse } from 'src/helpers/ApiResponse';
import { generateOtp, getExpirationTime } from 'src/helpers/index';
import { Msg } from 'src/helpers/responseMsg';

import { User, UserDocument } from 'src/modules/user/schema/user.schema';
import { SendOtpDto } from './dto/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    try {
      const otp = '9999';
      const otpExpireAt = getExpirationTime();

      const userExists = await this.userModel.findOne({
        phoneNumber: dto.phoneNumber,
      });

      // New user
      if (!userExists) {
        const user = await this.userModel.create({
          phoneNumber: dto.phoneNumber,
          roles: dto.roles || [],
          otp,
          otpExpireAt,
          isVerified: false,
          isProfileCompleted: false,
        });

        return new ApiResponse(200, user, Msg.OTP_SENT);
      }

      // Existing user
      const user = await this.userModel.findOneAndUpdate(
        {
          phoneNumber: dto.phoneNumber,
        },
        {
          $set: {
            otp,
            otpExpireAt,
          },

          $addToSet: {
            roles: { $each: dto.roles || [] },
          },
        },
        {
          new: true,
        },
      );

      return new ApiResponse(200, user, Msg.OTP_SENT);
    } catch (error) {
      console.log('error while sending otp', error);

      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
