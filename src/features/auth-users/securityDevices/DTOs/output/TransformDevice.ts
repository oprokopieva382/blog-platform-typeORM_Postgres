import { Injectable } from '@nestjs/common';
import { SessionDocument } from 'src/features/auth-users/auth/schemas/Session.schema';
import { DeviceViewModel } from './DeviceViewModel';

@Injectable()
export class TransformDevice {
  constructor() {}

  async transformToViewModel(
    device: SessionDocument,
  ): Promise<DeviceViewModel> {
    return {
      ip: device.ip,
      title: device.deviceName,
      lastActiveDate: device.iat,
      deviceId: device.deviceId,
    };
  }
}
