import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    console.log('CurrentUserId', request.user.id);
    return request.user.id;
  },
);
