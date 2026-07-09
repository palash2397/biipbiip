import { Module } from '@nestjs/common';
import { RideTypeService } from './ride-type.service';
import { RideTypeController } from './ride-type.controller';

@Module({
  controllers: [RideTypeController],
  providers: [RideTypeService],
})
export class RideTypeModule {}
