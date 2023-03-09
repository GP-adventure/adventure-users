import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsNumber, IsEmail } from 'class-validator';

export class GeneralConfig {
  @IsNumber()
  public port!: number;
}

export class JWTConfig {
  @IsString()
  public readonly secret!: string;

  @IsNumber()
  public readonly expirationTime!: number;

  @IsString()
  public readonly verificationToken!: string;

  @IsNumber()
  public readonly verifitationExpirationTime!: number;

  @IsString()
  public readonly emailConfirmationUrl!: string;
}

export class DatabaseConfig {
  @IsString()
  public readonly user!: string;

  @IsString()
  public readonly password!: string;

  @IsString()
  public readonly host!: string;

  @IsString()
  public readonly db!: string;

  @IsNumber()
  public port!: number;
}

export class SmtpConfig {
  @IsEmail()
  public readonly user!: string;

  @IsString()
  public readonly password!: string;

  @IsString()
  public readonly host!: string;
}

export class RootConfig {
  @Type(() => GeneralConfig)
  @ValidateNested()
  public readonly general!: GeneralConfig;

  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly db!: DatabaseConfig;

  @Type(() => JWTConfig)
  @ValidateNested()
  public readonly jwt!: JWTConfig;

  @Type(() => SmtpConfig)
  @ValidateNested()
  public readonly email!: SmtpConfig;
}
