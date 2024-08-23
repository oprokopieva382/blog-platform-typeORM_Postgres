import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { TokenService } from 'src/base/application/jwt.service';
import { Inject } from '@nestjs/common';
import { AppSettings } from 'src/settings/app-settings';

type SessionDataType = {
  refreshToken: string;
};

export class UpdateSessionCommand {
  constructor(public sessionData: SessionDataType) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    @Inject(AppSettings.name)
    private readonly appSettings: AppSettings,
  ) {}

  async execute(command: UpdateSessionCommand) {
    const refreshTokenSecret =
      this.appSettings.api.JWT_REFRESH_TOKEN_SECRET ?? '';

    const { iat, exp, deviceId } = await this.tokenService.verifyToken(
      command.sessionData.refreshToken,
      refreshTokenSecret,
    );

    const tokenIat = fromUnixTime(+iat!);
    const dbIat = new Date(iat!);

    if (tokenIat > dbIat) {
      await this.authRepository.updateSession({
        iat: tokenIat.toISOString(),
        exp: fromUnixTime(+exp!).toISOString(),
        deviceId: deviceId,
      });
    }
  }
}
