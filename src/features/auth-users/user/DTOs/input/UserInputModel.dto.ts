import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class UserInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
