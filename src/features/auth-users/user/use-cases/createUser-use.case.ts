import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputModel } from '../DTOs/input/UserInputModel.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { UserRepository } from '../user.repository';
import { AuthService } from '../../auth/auth.service';

export class CreateUserCommand {
  constructor(public dto: UserInputModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly authService: AuthService,
    readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand) {
    const hashedPassword = await this.authService.createHash(
      command.dto.password,
    );
    const userDto = {
      ...command.dto,
      password: hashedPassword,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
    };
    return await this.userRepository.createUser(userDto);
  }
}
