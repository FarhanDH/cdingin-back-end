import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v7 as uuidv7 } from 'uuid';

/**
 * This class is a middleware function that logs information about incoming requests.
 *
 */
@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  /**
   * Executes the middleware function  that logs information about incoming requests. It extracts the IP address, HTTP method, and URL from the request object. It also logs the status code of the response and the IP address of the client.
   *
   * @param {Request} request - The incoming request.
   * @param {Response} response - The outgoing response.
   * @param {NextFunction} next - The next middleware function.
   * @return {void} This function does not return a value.
   */
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url, params, query, body } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    const startTime = Date.now();
    const requestId = uuidv7();

    request.headers['request-id'] = requestId;
    response.setHeader('X-Request-Id', requestId);

    const logMessage = {
      requestId,
      ip,
      url,
      method,
      params,
      query,
      body,
      userAgent,
    };

    this.logger.log('Incoming Request: ', logMessage);

    response.on('finish', () => {
      const { statusCode } = response;
      const responseTime = Date.now() - startTime;
      const responseLogMessage = {
        statusCode,
        ...logMessage,
        responseTime: responseTime + 'ms',
      };

      if (statusCode >= 500) {
        this.logger.error('Request Failed:', responseLogMessage);
      } else if (statusCode >= 400) {
        this.logger.warn('Client Error: ', responseLogMessage);
      } else {
        this.logger.log('Request Completed: ', responseLogMessage);
      }
    });

    next();
  }
}
