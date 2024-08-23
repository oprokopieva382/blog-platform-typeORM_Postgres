import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from '../device.repository';

export class DeleteDevicesCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteDevicesCommand)
export class DeleteDevicesUseCase
  implements ICommandHandler<DeleteDevicesCommand>
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async execute(command: DeleteDevicesCommand) {
    await this.deviceRepository.removeDevices(command.deviceId, command.userId);
  }
}
