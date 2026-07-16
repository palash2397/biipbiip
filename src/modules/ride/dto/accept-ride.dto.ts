import { IsMongoId } from 'class-validator';

export class AcceptRideDto {
  @IsMongoId()
  rideId: string;
}
