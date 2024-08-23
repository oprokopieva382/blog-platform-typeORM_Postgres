import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class RegistrationConfirmationCodeModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  code: string;
}
