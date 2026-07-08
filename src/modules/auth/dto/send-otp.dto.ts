import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from 'src/common/enums/user/role.enum';

export class SendOtpDto {
  @ApiProperty({ enum: UserRole, isArray: true })
  @IsOptional()
  @IsEnum(UserRole, { each: true, message: 'Invalid role provided' })
  roles: UserRole[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
