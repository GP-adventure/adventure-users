import { Body, Controller, Post, Request, Res, UnauthorizedException } from '@nestjs/common';
import Users from 'src/features/users/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { GrpcMethod } from '@nestjs/microservices';
import { EmailConfirmationService } from 'src/features/email-confirmation/email-confirmation.service';
import { LoginDto } from './dto/login.dto';
import {
  LoginResponse,
  LoginResult,
  LogoutResponse,
  RegisterResponse,
  WhoAmIRequest,
  WhoAmIResponse,
  WhoAmIResult,
} from './auth.pb';
import { Metadata } from '@grpc/grpc-js';
import RequestWithUser from './requestWithUser';
import { JwtService } from '@nestjs/jwt';
import { ValidateDto } from './dto/validate.dto';

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
    const cookie = this.authService.getCookieWithJwtToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
    });
    return { data: { ...user, token: cookie } };
  }

  @GrpcMethod('AuthService', 'register')
  async register(@Body() registrationData: RegisterDto): Promise<RegisterResponse> {
    const user = await this.authService.register(registrationData);
    await this.emailConfirmationService.sendVerificationLink(registrationData.email);
    return { data: user };
  }

  @GrpcMethod('AuthService', 'logout')
  async logOut(@Res() res: Response): Promise<LogoutResponse> {
    return { data: { token: this.authService.getCookieForLogOut() } };
  }

  @GrpcMethod('AuthService', 'WhoAmI')
  public async getIdentity(@Body() { token }: ValidateDto): Promise<WhoAmIResponse> {
    const decoded = this.jwtService.decode(token, null) as WhoAmIResult | null;
    if (decoded === null) {
      throw new UnauthorizedException('Wrong Token. Please log in again');
    }
    return {
      data: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        isEmailConfirmed: decoded.isEmailConfirmed,
      },
    };
  }
}
