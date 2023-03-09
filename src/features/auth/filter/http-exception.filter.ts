import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { GenericResponse } from 'src/features/auth/auth.pb';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost): Promise<GenericResponse> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    const status: HttpStatus = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      return {
        error: {
          error: exception.name,
          message: exception.message,
          statusCode: status,
        },
      };
    }

    return {
      error: {
        statusCode: status,
        message: exception.message,
        error: exception.name,
      },
    };
  }
}
