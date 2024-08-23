import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { fromUnixTime } from 'date-fns/fromUnixTime';

type SessionDataType = {
  userId: string;
  deviceId: string;
  iat: string;
  deviceName: string;
  ip: string;
  exp: string;
};

export class CreateSessionCommand {
  constructor(public sessionData: SessionDataType) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: CreateSessionCommand) {
    const newSession = {
      userId: command.sessionData.userId,
      deviceId: command.sessionData.deviceId,
      iat: fromUnixTime(Number(command.sessionData.iat)).toISOString(),
      deviceName: command.sessionData.deviceName,
      ip: command.sessionData.ip,
      exp: fromUnixTime(Number(command.sessionData.exp)).toISOString(),
    };
    await this.authRepository.createSession(newSession);

    return newSession;
  }
}
