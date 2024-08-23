import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../device.repository';
import { AuthRepository } from '../../auth/auth.repository';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class DeleteDeviceByIdCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceByIdCommand)
export class DeleteDeviceByIdUseCase
  implements ICommandHandler<DeleteDeviceByIdCommand>
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: DeleteDeviceByIdCommand) {
    const dbSession = await this.authRepository.getSessionByDeviceId(
      command.deviceId,
    );
    if (!dbSession) {
      throw new NotFoundException();
    }

    if (command.userId !== dbSession.userId) {
      throw new ForbiddenException();
    }

    await this.deviceRepository.removeDevice(command.deviceId);
  }
}
