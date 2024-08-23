import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class NewPasswordRecoveryInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  recoveryCode: string;
}
