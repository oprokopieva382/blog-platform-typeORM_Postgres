import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../auth/schemas/Session.schema';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: Model<SessionDocument>,
  ) {}

  async removeDevice(deviceId: string) {
    return await this.SessionModel.findOneAndDelete({
      deviceId,
    });
  }

  async removeDevices(currentSessionDeviceId: string, userId: string) {
    return await this.SessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentSessionDeviceId },
    });
  }
}
