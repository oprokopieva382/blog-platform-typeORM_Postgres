import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../auth.repository';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { EmailService } from 'src/base/application/email.service';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const passwordRecoveryCodeDto = {
      recoveryCode: randomUUID(),
      email: command.email,
      expirationDate: add(new Date(Date.now()).toISOString(), {
        hours: 1,
      }),
      createdAt: new Date().toISOString(),
    };

    const { recoveryCode } = await this.authRepository.savePasswordRecoveryInfo(
      passwordRecoveryCodeDto,
    );

    await this.emailService.sendPasswordRecoveryEmail(
      command.email,
      recoveryCode,
    );
  }
}
