import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('Password or email address is incorrect', HttpStatus.UNAUTHORIZED);
  }
}
