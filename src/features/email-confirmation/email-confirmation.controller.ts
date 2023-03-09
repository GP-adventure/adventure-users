import { ClassSerializerInterceptor } from '@nestjs/common';
import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common/decorators';
import RequestWithUser from 'src/features/auth/requestWithUser';
import { EmailConfirmationDto } from './dto/emailConfirmation.dto';
import { EmailConfirmationService } from './email-confirmation.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(private readonly emailConfrmationService: EmailConfirmationService) {}

  @GrpcMethod('AuthService', 'confirm')
  async confirm(@Body() confirmationData: EmailConfirmationDto): Promise<void> {
    const email = await this.emailConfrmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfrmationService.confirmEmail(email);
  }

  @GrpcMethod('AuthService', 'resend-confirmation-link')
  async resendConfirmationLink(@Req() request: RequestWithUser): Promise<void> {
    await this.emailConfrmationService.resendConfirmationLink(request.user.id);
  }
}
