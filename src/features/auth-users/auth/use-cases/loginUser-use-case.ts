import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import {
  CreateSessionCommand,
  CreateSessionUseCase,
} from './createSession-use-case';
import { TokenService } from 'src/base/application/jwt.service';
import { AppSettings } from 'src/settings/app-settings';
import { Inject } from '@nestjs/common';

export class LoginUserCommand {
  constructor(
    public user: any,
    public ip: string,
    public headers: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly createSessionUseCase: CreateSessionUseCase,
    @Inject(AppSettings.name)
    private readonly appSettings: AppSettings,
  ) {}

  async execute(command: LoginUserCommand) {
    //get token secrets value
    const accessTokenSecret = this.appSettings.api.JWT_ACCESS_TOKEN_SECRET ?? '';
    const refreshTokenSecret = this.appSettings.api.JWT_REFRESH_TOKEN_SECRET ?? "";

    //gen values for session
    const deviceId = randomUUID();
    const IP = command.ip;
    const deviceName = command.headers['user-agent'] || 'Unknown Device';

    //set tokens payload
    const payloadAT = { sub: command.user._id };
    const payloadRT = {
      sub: command.user._id,
      deviceId,
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

    const { iat, exp } = await this.tokenService.verifyToken(
      refreshToken,
      refreshTokenSecret,
    );

    await this.createSessionUseCase.execute(
      new CreateSessionCommand({
        userId: command.user._id,
        deviceId,
        iat: iat.toString(),
        deviceName,
        ip: IP,
        exp: exp.toString(),
      }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
