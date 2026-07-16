import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';

import { RideService } from './ride.service';
import { AcceptRideDto } from './dto/accept-ride.dto';

@WebSocketGateway({
  path: '/viamo/socket.io',
  cors: {
    origin: '*',
  },
})
export class RideGateway {
  constructor(private readonly rideService: RideService) {}

  @SubscribeMessage('acceptRide')
  async acceptRide(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AcceptRideDto,
  ) {
    const userId = client.data.user.id;

    return this.rideService.acceptRide(userId, data);
  }
}
