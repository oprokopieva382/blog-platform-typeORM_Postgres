import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransformDevice } from './DTOs/output/TransformDevice';
import { Session, SessionDocument } from '../auth/schemas/Session.schema';
import { DeviceViewModel } from './DTOs/output/DeviceViewModel';

@Injectable()
export class DeviceQueryRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: Model<SessionDocument>,
    private readonly TransformDevice: TransformDevice,
  ) {}

  async getDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices = await this.SessionModel.find({
      userId,
    }).exec();

    return Promise.all(
      devices.map((d) => this.TransformDevice.transformToViewModel(d)),
    );
  }
}
