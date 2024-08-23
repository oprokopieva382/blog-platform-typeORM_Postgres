import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { BadRequestException } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { UserInputModel } from 'src/features/auth-users/user/DTOs/input/UserInputModel.dto';
import { EmailService } from 'src/base/application/email.service';
import { AuthService } from '../auth.service';

export class RegisterUserCommand {
  constructor(public dto: UserInputModel) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const userL = await this.authRepository.getByLogin(command.dto.login);
    const userE = await this.authRepository.getByEmail(command.dto.email);

    if (userL) {
      throw new BadRequestException([
        { message: 'User already exist', field: 'login' },
      ]);
    }
    if (userE) {
      throw new BadRequestException([
        { message: 'User already exist', field: 'email' },
      ]);
    }

    const hashedPassword = await this.authService.createHash(
      command.dto.password,
    );

    const userDto = {
      login: command.dto.login,
      email: command.dto.email,
      password: hashedPassword,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
    };

    const user = await this.authRepository.registerUser(userDto);

    await this.emailService.sendRegistrationEmail(
      userDto.email,
      userDto.emailConfirmation.confirmationCode,
    );

    return user;
  }
}
