import { IsNotEmpty, IsString } from 'class-validator';
import { UserDocument } from 'src/features/auth-users/user/schemas/User.schema';

export class MeViewModel {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export const transformToViewUser = (user: UserDocument): MeViewModel => {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
};
