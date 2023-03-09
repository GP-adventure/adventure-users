import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/features/users/users.module';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
  imports: [EmailModule, UsersModule],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
