import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { BadRequestException } from '@nestjs/common';

export class ConfirmationRegistrationUserCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationRegistrationUserCommand)
export class ConfirmationRegistrationUserUseCase
  implements ICommandHandler<ConfirmationRegistrationUserCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: ConfirmationRegistrationUserCommand) {
    const findUser = await this.authRepository.getByConfirmationCode(
      command.code,
    );
    if (!findUser || findUser.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        {
          message:
            'Confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    }
    return await this.authRepository.updateConfirmation(findUser._id);
  }
}
