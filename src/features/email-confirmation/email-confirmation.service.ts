import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RootConfig } from 'src/configuration';
import EmailService from 'src/email/email.service';
import { errorTokenGuard } from 'src/utils/createGuard';
import { UsersService } from 'src/features/users/users.service';
import { VerifitationTokenPayload } from './verificationTokenPayload.interface';

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: RootConfig,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public async sendVerificationLink(email: string): Promise<void> {
    const payload: VerifitationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.jwt.verificationToken,
      expiresIn: `${this.configService.jwt.verifitationExpirationTime}s`,
    });

    const url = `${this.configService.jwt.emailConfirmationUrl}?token=${token}`;

    const html = `
    <h1> Welcome to Adventure App </h1>
    <p> To confirm the email address, click here: ${url} </p>
    `;

    await this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      html,
    });
    return;
  }

  public async confirmEmail(email: string): Promise<void> {
    const user = await this.usersService.findOne(email);
    if (user === null) {
      throw new NotFoundException('User with that email not exist');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.usersService.markEmailAsConfirmed(email);
    return;
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload: VerifitationTokenPayload = await this.jwtService.verify(token, {
        secret: this.configService.jwt.verificationToken,
      });

      if (typeof payload === 'object') {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (errorTokenGuard(error) && error.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(userId: number): Promise<void> {
    const user = await this.usersService.getById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.sendVerificationLink(user.email);
  }
}
