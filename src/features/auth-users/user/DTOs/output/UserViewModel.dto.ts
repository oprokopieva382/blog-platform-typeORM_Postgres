import { IsNotEmpty, IsString } from 'class-validator';

export class UserViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;
}

