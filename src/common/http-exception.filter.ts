import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      request_id: request.headers['request-id'],
      errors:
        typeof message === 'string'
          ? message
          : (message as Record<string, unknown>)['message'] ??
            (message as Record<string, unknown>)['errors'],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
