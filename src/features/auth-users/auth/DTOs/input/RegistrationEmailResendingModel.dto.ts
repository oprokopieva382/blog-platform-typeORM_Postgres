import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class RegistrationEmailResendingModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
