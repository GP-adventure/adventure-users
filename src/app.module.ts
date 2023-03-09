import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CoreModules } from './coreModules.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';

@Module({
  imports: [
    CoreModules,
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmailConfirmationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_app: NestExpressApplication): void {
    // your app configuration goes heree
  }
}
