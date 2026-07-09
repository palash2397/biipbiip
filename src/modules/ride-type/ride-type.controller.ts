import { Controller } from '@nestjs/common';
import { RideTypeService } from './ride-type.service';

@Controller('ride-type')
export class RideTypeController {
  constructor(private readonly rideTypeService: RideTypeService) {}
}
