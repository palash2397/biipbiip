import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schema/chat-message.schema';
import { User, UserSchema } from 'src/modules/user/schema/user.schema';
import { Ride, RideSchema } from '../ride/schema/ride.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: User.name, schema: UserSchema },
      { name: Ride.name, schema: RideSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
})
export class ChatModule {}
