import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IsAuthRefreshTokenGuard } from '../auth/guards/is-auth-refresh-token.guard';
import { DeviceQueryRepository } from './device.query.repository';
import { DeleteDevicesCommand } from './use-cases/deleteDevices-use-case';
import { DeleteDeviceByIdCommand } from './use-cases/deleteDeviceById-use-case';

@Controller('security/devices')
@UseGuards(IsAuthRefreshTokenGuard)
export class DeviceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly deviceQueryRepository: DeviceQueryRepository,
  ) {}

  @Get()
  async getDevices(@Request() req) {
    return await this.deviceQueryRepository.getDevices(req.userId);
  }

  @Delete('')
  @HttpCode(204)
  async deleteDevices(@Request() req) {
    await this.commandBus.execute(
      new DeleteDevicesCommand(req.userId, req.deviceId),
    );
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async deleteDeviceById(@Param('deviceId') deviceId: string, @Request() req) {
    await this.commandBus.execute(
      new DeleteDeviceByIdCommand(req.userId, deviceId),
    );
  }
}
