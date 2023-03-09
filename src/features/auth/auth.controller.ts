import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import Users from 'src/features/users/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { GrpcMethod } from '@nestjs/microservices';
import { EmailConfirmationService } from 'src/features/email-confirmation/email-confirmation.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './auth.pb';
import { Metadata } from '@grpc/grpc-js';
import RequestWithUser from './requestWithUser';

@Controller('auth')
export class AuthController {
  public constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @GrpcMethod('AuthService', 'login')
  public async login(payload: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.login(payload);
    const srvMetadata = new Metadata();
    const cookie = this.authService.getCookieWithJwtToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    });
    srvMetadata.set('Set-Cookie', cookie);
    // req.res?.setHeader('Set-Cookie', cookie);
    return { data: { ...user, token: cookie } };
  }

  @GrpcMethod('AuthService', 'register')
  async register(@Body() registrationData: RegisterDto): Promise<Users> {
    const user = await this.authService.register(registrationData);
    await this.emailConfirmationService.sendVerificationLink(registrationData.email);
    return user;
  }

  @GrpcMethod('AuthService', 'logout')
  async logOut(@Res() res: Response): Promise<void> {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    res.sendStatus(200);
  }

  @GrpcMethod('AuthService', 'whoami')
  public async getIdentity(@Request() req: RequestWithUser): Promise<Users> {
    const decoded = this.jwtService.decode();
    return req.user;
  }
}
