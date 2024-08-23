import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async testPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async validateUser(data: string, password: string): Promise<any> {
    const user = await this.authRepository.getByLogin(data);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordCorrect = await this.testPassword(password, user.password);

    if (user && isPasswordCorrect) {
      const { password, ...result } = user.toObject();
      return result;
    }
  }
}
