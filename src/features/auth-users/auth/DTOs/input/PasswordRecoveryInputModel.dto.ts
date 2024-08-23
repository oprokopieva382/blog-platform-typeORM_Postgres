import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class PasswordRecoveryInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
