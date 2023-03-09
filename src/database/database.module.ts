import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/config/configuration';
import Users from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: (databaseConfig: DatabaseConfig) => {
        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.user,
          password: databaseConfig.password,
          database: databaseConfig.db,
          entities: [Users],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
