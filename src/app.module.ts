import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CoreModules } from './coreModules.module';
import { EmailConfirmationModule } from './features/email-confirmation/email-confirmation.module';
import * as cookieParser from 'cookie-parser';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [CoreModules, DatabaseModule, AuthModule, EmailConfirmationModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
