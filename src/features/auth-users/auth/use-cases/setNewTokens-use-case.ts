import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from 'src/base/application/jwt.service';
import {
  UpdateSessionCommand,
  UpdateSessionUseCase,
} from './updateSession-use-case';
import { AppSettings } from 'src/settings/app-settings';
import { Inject } from '@nestjs/common';

export class SetNewTokensCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(SetNewTokensCommand)
export class SetNewTokensUseCase
  implements ICommandHandler<SetNewTokensCommand>
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly updateSessionUseCase: UpdateSessionUseCase,
    @Inject(AppSettings.name)
    private readonly appSettings: AppSettings,
  ) {}

  async execute(command: SetNewTokensCommand) {
    //get token secrets value
    const accessTokenSecret =
      this.appSettings.api.JWT_ACCESS_TOKEN_SECRET ?? '';
    const refreshTokenSecret =
      this.appSettings.api.JWT_REFRESH_TOKEN_SECRET ?? '';

    const payloadAT = { sub: command.userId };
    const payloadRT = {
      sub: command.userId,
      deviceId: command.deviceId,
    };

    const accessToken = this.tokenService.generateToken(
      payloadAT,
      accessTokenSecret,
      //'10m',
      '10s',
    );

    const refreshToken = this.tokenService.generateToken(
      payloadRT,
      refreshTokenSecret,
      //'20m',
      '20s',
    );

    await this.updateSessionUseCase.execute(
      new UpdateSessionCommand({
        refreshToken,
      }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
