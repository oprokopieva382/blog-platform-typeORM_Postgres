import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const encodeString = authorization.split(' ');
    const tokenFirstPart = encodeString[0];
    const tokenSecondPart = encodeString[1];

    if (tokenFirstPart !== 'Basic') {
      throw new UnauthorizedException();
    }

    const bytes = Buffer.from(tokenSecondPart, 'base64').toString('utf8');

    if (bytes !== this.configService.get<string>('ADMIN_AUTH')) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
