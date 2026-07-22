import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket, Server } from 'socket.io';

import { RideStatus } from 'src/common/enums/ride/ride-enum';

import { Ride, RideDocument } from 'src/modules/ride/schema/ride.schema';
import {
  Driver,
  DriverDocument,
} from 'src/modules/driver/schema/driver.schema';
import { User, UserDocument } from 'src/modules/user/schema/user.schema';
import { ChatMessage, ChatMessageDocument } from './schema/chat-message.schema';

import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

import { ApiResponse } from 'src/helpers/ApiResponse';
import { Msg } from 'src/helpers/responseMsg';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Ride.name)
    private readonly rideModel: Model<RideDocument>,

    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async joinRideChat(client: Socket, dto: JoinChatDto) {
    try {
      const userId = client.data.user.id;

      const ride = await this.rideModel.findById(dto.rideId);

      if (!ride) {
        return new ApiResponse(404, {}, Msg.RIDE_NOT_FOUND);
      }

      if (!ride.driver) {
        return new ApiResponse(400, {}, Msg.DRIVER_NOT_ASSIGNED);
      }

      const isPassenger = ride.user.toString() === userId;
      const isDriver = ride.driver.toString() === userId;

      if (!isPassenger && !isDriver) {
        return new ApiResponse(401, {}, Msg.UNAUTHORIZED);
      }

      const allowedStatuses = [
        RideStatus.DRIVER_FOUND,
        RideStatus.DRIVER_ARRIVED,
        RideStatus.ONGOING,
        RideStatus.PAYMENT_PENDING,
      ];

      if (!allowedStatuses.includes(ride.status)) {
        return new ApiResponse(400, {}, Msg.CHAT_IS_NOT_AVAILABLE);
      }

      const roomName = `ride:${ride._id}`;

      client.join(roomName);

      console.log(`${userId} joined ${roomName}`);

      return new ApiResponse(200, {}, Msg.CHAT_JOINED);
    } catch (error) {
      console.log('Error in joinRideChat:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sendMessage(client: Socket, dto: SendMessageDto, server: Server) {
    try {
      const userId = client.data.user.id;

      const ride = await this.rideModel.findById(dto.rideId);

      if (!ride) {
        return new ApiResponse(404, {}, Msg.RIDE_NOT_FOUND);
      }

      const isPassenger = ride.user.toString() === userId;
      const isDriver = ride.driver?.toString() === userId;

      if (!isPassenger && !isDriver) {
        return new ApiResponse(401, {}, Msg.UNAUTHORIZED);
      }

      const receiverId = isPassenger
        ? ride?.driver?.toString()
        : ride.user.toString();

      const message = await this.chatMessageModel.create({
        ride: ride._id,
        sender: userId,
        receiver: receiverId,
        message: dto.message,
        messageType: dto.messageType,
      });

      const chatMessage = await this.chatMessageModel
        .findById(message._id)
        .populate('sender', 'fullName profileImage')
        .lean();

      server.to(`ride:${ride._id}`).emit('newMessage', chatMessage);

      return new ApiResponse(200, chatMessage, Msg.MESSAGE_SENT);
    } catch (error) {
      console.log('Error in sendMessage:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
