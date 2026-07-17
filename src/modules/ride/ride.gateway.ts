import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';

import { RideService } from './ride.service';
import { AcceptRideDto } from './dto/accept-ride.dto';
// import { RejectRideDto } from './dto/reject-ride.dto';

import { CancelRideDto } from './dto/cancel-ride.dto';

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

  // @SubscribeMessage('rejectRide')
  // async rejectRide(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() dto: RejectRideDto,
  // ) {
  //   return this.rideService.rejectRide(client.data.user.id, dto);
  // }

  // @SubscribeMessage('cancelRide')
  // async cancelRide(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() dto: CancelRideDto,
  // ) {
  //   const userId = client.data.user.id;

  //   return this.rideService.cancelRide(userId, dto);
  // }
}
