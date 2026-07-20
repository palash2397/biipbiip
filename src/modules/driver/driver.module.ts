import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Driver, DriverSchema } from './schema/driver.schema';
import { User, UserSchema } from 'src/modules/user/schema/user.schema';
import { Ride, RideSchema } from '../ride/schema/ride.schema';

import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: User.name, schema: UserSchema },
      { name: Ride.name, schema: RideSchema },
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: User.name, schema: UserSchema },
    ]),

    DriverService,
  ],
})
export class DriverModule {}
