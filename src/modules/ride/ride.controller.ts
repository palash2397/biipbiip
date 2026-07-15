import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

import { RideService } from './ride.service';
import { BookRideDto } from './dto/book-ride.dto';

@ApiTags('Ride')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('/bookRide')
  bookRide(@Req() req: any, @Body() dto: BookRideDto) {
    return this.rideService.bookRide(req.user.id, dto);
  }
}
