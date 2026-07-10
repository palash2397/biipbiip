import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Driver, DriverSchema } from './schema/driver.schema';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
  ],
})
export class DriverModule {}
