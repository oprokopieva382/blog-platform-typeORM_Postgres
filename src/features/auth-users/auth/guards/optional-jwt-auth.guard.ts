import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || info) {
      return true; // No user, but don't throw an error
    }
    return user; // User is valid, proceed
  }
}
