import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';

export class DeleteSessionCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: DeleteSessionCommand) {
    await this.authRepository.deleteSession(command.deviceId);
  }
}
