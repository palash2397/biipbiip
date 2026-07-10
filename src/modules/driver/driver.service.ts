import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ApiResponse } from 'src/helpers/ApiResponse';
import { Msg } from 'src/helpers/responseMsg';
import { deleteOldFile } from 'src/helpers/index';

import { Driver, DriverDocument } from './schema/driver.schema';
import { UpdateDriverDetailsDto } from './dto/update-driver-details.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
  ) {}

  async updateDriverDetails(
    userId: string,
    dto: UpdateDriverDetailsDto,
    files?: any,
  ) {
    try {
      const driver = await this.driverModel.findOne({ user: userId });

      const updatedDriver = await this.driverModel.findOneAndUpdate(
        { user: userId },
        { ...dto, user: userId },
        { new: true, upsert: true },
      );

      if (!updatedDriver) {
        return new ApiResponse(400, {}, Msg.SERVER_ERROR);
      }

      if (files) {
        if (files.nationalIdFront) {
          if (driver && driver.nationalIdFront) {
            deleteOldFile('driver', driver.nationalIdFront);
          }
          updatedDriver.nationalIdFront = files.nationalIdFront[0].filename;
        }

        if (files.nationalIdBack) {
          if (driver && driver.nationalIdBack) {
            deleteOldFile('driver', driver.nationalIdBack);
          }
          updatedDriver.nationalIdBack = files.nationalIdBack[0].filename;
        }

        if (files.driverLicenseFront) {
          if (driver && driver.driverLicenseFront) {
            deleteOldFile('driver', driver.driverLicenseFront);
          }
          updatedDriver.driverLicenseFront = files.driverLicenseFront[0].filename;
        }

        if (files.driverLicenseBack) {
          if (driver && driver.driverLicenseBack) {
            deleteOldFile('driver', driver.driverLicenseBack);
          }
          updatedDriver.driverLicenseBack = files.driverLicenseBack[0].filename;
        }

        if (files.vehicleRegistrationFront) {
          if (driver && driver.vehicleRegistrationFront) {
            deleteOldFile('driver', driver.vehicleRegistrationFront);
          }
          updatedDriver.vehicleRegistrationFront = files.vehicleRegistrationFront[0].filename;
        }

        if (files.vehicleRegistrationBack) {
          if (driver && driver.vehicleRegistrationBack) {
            deleteOldFile('driver', driver.vehicleRegistrationBack);
          }
          updatedDriver.vehicleRegistrationBack = files.vehicleRegistrationBack[0].filename;
        }

        if (files.vehiclePhotos) {
          if (driver && driver.vehiclePhotos && driver.vehiclePhotos.length > 0) {
            driver.vehiclePhotos.forEach((photo) => {
              deleteOldFile('driver', photo);
            });
          }
          updatedDriver.vehiclePhotos = files.vehiclePhotos.map((f: any) => f.filename);
        }

        await updatedDriver.save();
      }

      const baseUrl = process.env.BASE_URL;

      updatedDriver.nationalIdFront = updatedDriver.nationalIdFront
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.nationalIdFront}`
        : undefined;

      updatedDriver.nationalIdBack = updatedDriver.nationalIdBack
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.nationalIdBack}`
        : undefined;

      updatedDriver.driverLicenseFront = updatedDriver.driverLicenseFront
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.driverLicenseFront}`
        : undefined;

      updatedDriver.driverLicenseBack = updatedDriver.driverLicenseBack
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.driverLicenseBack}`
        : undefined;

      updatedDriver.vehicleRegistrationFront = updatedDriver.vehicleRegistrationFront
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.vehicleRegistrationFront}`
        : undefined;

      updatedDriver.vehicleRegistrationBack = updatedDriver.vehicleRegistrationBack
        ? `${baseUrl}/api/v1/uploads/driver/${updatedDriver.vehicleRegistrationBack}`
        : undefined;

      if (updatedDriver.vehiclePhotos && updatedDriver.vehiclePhotos.length > 0) {
        updatedDriver.vehiclePhotos = updatedDriver.vehiclePhotos.map(
          (photo) => `${baseUrl}/api/v1/uploads/driver/${photo}`
        );
      }

      return new ApiResponse(200, updatedDriver, Msg.DRIVER_UPDATED);
    } catch (error) {
      console.log('Error updating driver details:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
