import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/base/application/email.service';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase
  implements ICommandHandler<RegistrationEmailResendingCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegistrationEmailResendingCommand) {
    const findUser = await this.authRepository.getByEmail(command.email);

    if (!findUser || findUser.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        {
          message: 'Incorrect input value',
          field: 'email',
        },
      ]);
    }
    const newCode = randomUUID();
    await this.authRepository.updateCode(findUser._id, newCode);

    await this.emailService.sendRegistrationEmail(command.email, newCode);

    return findUser;
  }
}
