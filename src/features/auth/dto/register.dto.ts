import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RegisterRequest } from 'src/features/auth/auth.pb';

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password!: string;
}
