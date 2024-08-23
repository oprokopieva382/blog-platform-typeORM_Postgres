import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../post.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: DeletePostCommand) {
    return await this.postRepository.deletePost(command.id);
  }
}
