import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand) {
    return await this.userRepository.deleteUser(command.id);
  }
}
