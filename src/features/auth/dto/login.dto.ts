import { LoginRequest } from 'src/features/auth/auth.pb';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto implements LoginRequest {
  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;
}
