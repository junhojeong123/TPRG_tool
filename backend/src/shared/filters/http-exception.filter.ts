import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 모든 타입의 예외를 캐치합니다.
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
       ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
       ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      // class-validator가 생성하는 복잡한 오류 메시지를 처리하기 위한 로직
      message: typeof message === 'string'? message : (message as any).message,
      error:
        exception instanceof HttpException
         ? (message as any).error |

| exception.message
          : 'Error',
      // 로깅 시스템과 연동하기 위한 correlationId
      correlationId: request.headers['x-correlation-id'],
    };

    response.status(status).json(errorResponse);
  }
}