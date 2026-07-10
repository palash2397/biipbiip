import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { multerConfig } from 'src/common/middlewares/multer';

import { DriverService } from './driver.service';
import { UpdateDriverDetailsDto } from './dto/update-driver-details.dto';

@ApiTags('Driver')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Patch('/details')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nationalIdFront', maxCount: 1 },
        { name: 'nationalIdBack', maxCount: 1 },
        { name: 'driverLicenseFront', maxCount: 1 },
        { name: 'driverLicenseBack', maxCount: 1 },
        { name: 'vehicleRegistrationFront', maxCount: 1 },
        { name: 'vehicleRegistrationBack', maxCount: 1 },
        { name: 'vehiclePhotos', maxCount: 4 },
      ],
      multerConfig('driver'),
    ),
  )
  updateDriverDetails(
    @Req() req: any,
    @Body() dto: UpdateDriverDetailsDto,
    @UploadedFiles() files?: any,
  ) {
    return this.driverService.updateDriverDetails(req.user.id, dto, files);
  }
}
