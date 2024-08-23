import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../schemas/User.schema';
import { UserViewModel } from './UserViewModel.dto';


@Injectable()
export class TransformUser {
  constructor() {}

  async transformToViewModel(user: UserDocument): Promise<UserViewModel> {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
