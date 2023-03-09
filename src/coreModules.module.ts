import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';
import { JWTConfig, RootConfig } from './config/configuration';

@Global()
@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({
        separator: '_',
      }),
      isGlobal: true,
      normalize(config) {
        config.db.port = parseInt(config.db.port, 10);
        config.general.port = parseInt(config.general.port, 10);
        config.jwt.expirationTime = parseInt(config.jwt.expirationTime, 10);
        config.jwt.verifitationExpirationTime = parseInt(
          config.jwt.verifitationExpirationTime,
          10,
        );
        return config;
      },
    }),
    JwtModule.registerAsync({
      inject: [JWTConfig],
      useFactory: async (configService: JWTConfig) => {
        return {
          secret: configService.secret,
          signOptions: { expiresIn: `${configService.expirationTime}s` },
        };
      },
    }),
  ],
  exports: [JwtModule, TypedConfigModule],
})
export class CoreModules {}
