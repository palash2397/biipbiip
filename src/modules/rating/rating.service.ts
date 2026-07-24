import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Rating, RatingDocument } from './schema/rating.schema';
import { Ride, RideDocument } from '../ride/schema/ride.schema';
import { User, UserDocument } from '../user/schema/user.schema';

import { UserRole } from 'src/common/enums/user/role.enum';
import { RideStatus } from 'src/common/enums/ride/ride-enum';

import { ApiResponse } from 'src/helpers/ApiResponse';
import { Msg } from 'src/helpers/responseMsg';

import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingFor } from 'src/common/enums/driver/rating-enum';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly ratingModel: Model<RatingDocument>,

    @InjectModel(Ride.name)
    private readonly rideModel: Model<RideDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createRating(userId: string, dto: CreateRatingDto) {
    try {
      const ride = await this.rideModel.findById(dto.rideId);

      if (!ride) {
        return new ApiResponse(404, {}, Msg.RIDE_NOT_FOUND);
      }

      if (ride.status !== RideStatus.COMPLETED) {
        return new ApiResponse(400, {}, Msg.RIDE_NOT_COMPLETED);
      }

      const isPassenger = ride.user.toString() === userId;

      const isDriver = ride.driver?.toString() === userId;

      if (!isPassenger && !isDriver) {
        return new ApiResponse(401, {}, Msg.UNAUTHORIZED);
      }

      let givenTo: string | undefined;
      let ratingFor: RatingFor;

      if (isPassenger) {
        givenTo = ride?.driver?.toString();
        ratingFor = RatingFor.DRIVER;
      } else {
        givenTo = ride.user?.toString();
        ratingFor = RatingFor.USER;
      }

      const alreadyRated = await this.ratingModel.findOne({
        ride: ride._id,
        givenBy: userId,
      });

      if (alreadyRated) {
        return new ApiResponse(400, {}, Msg.RATING_ALREADY_SUBMITTED);
      }

      const rating = await this.ratingModel.create({
        ride: ride._id,
        givenBy: userId,
        givenTo,
        ratingFor,
        rating: dto.rating,
        review: dto.review,
      });

      //   await this.updateAverageRating(givenTo);

      return new ApiResponse(201, rating, Msg.RATING_SUBMITTED);
    } catch (error) {
      console.log(error);

      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
