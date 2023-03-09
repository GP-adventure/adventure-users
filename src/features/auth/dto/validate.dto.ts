import { ValidateRequest } from 'src/features/auth/auth.pb';
import { IsString } from 'class-validator';

export class ValidateDto implements ValidateRequest {
  @IsString()
  public token!: string;
}
