import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log(status, ' status');
    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse = { errorsMessages: [] };

      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.map((m: any) =>
          // @ts-ignore
          errorsResponse.errorsMessages.push({
            message: m.message,
            field: m.field,
          }),
        );
      } else {
        return response.sendStatus(status);
      }
      return response.status(status).send(errorsResponse);
    } else {
      return response.sendStatus(status);
    }
  }
}
