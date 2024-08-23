import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenService } from 'src/base/application/jwt.service';
import { AuthRepository } from '../auth.repository';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class IsAuthRefreshTokenGuard implements CanActivate {
  private readonly refreshTokenSecret: string;
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {
    this.refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const token = await this.tokenService.verifyToken(
        refreshToken,
        this.refreshTokenSecret,
      );
      if (!token.sub) {
        throw new UnauthorizedException();
      }

      const currentSession = await this.authRepository.getSessionByDeviceId(
        token.deviceId,
      );
      if (!currentSession) {
        throw new UnauthorizedException();
      }

      if (currentSession.iat !== fromUnixTime(token.iat).toISOString()) {
        throw new UnauthorizedException();
      }

      if (typeof refreshToken !== 'string') {
        throw new UnauthorizedException();
      }

      request.userId = token.sub;
      request.deviceId = token.deviceId;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      }
      throw new UnauthorizedException();
    }
  }
}
