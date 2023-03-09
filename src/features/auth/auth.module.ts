import { Module } from '@nestjs/common';
import { UsersModule } from 'src/features/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { EmailConfirmationModule } from 'src/features/email-confirmation/email-confirmation.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, EmailConfirmationModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
