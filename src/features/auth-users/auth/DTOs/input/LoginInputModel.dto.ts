import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class LoginInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  loginOrEmail: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  password: string;
}
