import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceViewModel {
  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  lastActiveDate: string;

  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
