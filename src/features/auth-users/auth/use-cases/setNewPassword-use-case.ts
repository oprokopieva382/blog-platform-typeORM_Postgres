import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordRecoveryInputModel } from '../DTOs/input/NewPasswordRecoveryInputModel.dto';
import { AuthRepository } from '../auth.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

export class SetNewPasswordCommand {
  constructor(public data: NewPasswordRecoveryInputModel) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SetNewPasswordCommand) {
    const { newPassword, recoveryCode } = command.data;
    const result = await this.authRepository.getByRecoveryCode(recoveryCode);

    if (!result || new Date(result.expirationDate) < new Date()) {
      throw new BadRequestException();
    }
    const passwordHash = await this.authService.createHash(newPassword);

    await this.authRepository.setNewPassword(result.email, passwordHash);
  }
}
