import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

import { Ride, RideDocument } from 'src/modules/ride/schema/ride.schema';
import {
  Driver,
  DriverDocument,
} from 'src/modules/driver/schema/driver.schema';
import { User, UserDocument } from 'src/modules/user/schema/user.schema';

import { JoinChatDto } from './dto/join-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Ride.name)
    private readonly rideModel: Model<RideDocument>,

    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async joinRideChat(client: Socket, dto: JoinChatDto) {
    try {
    } catch (error) {}
  }
}
