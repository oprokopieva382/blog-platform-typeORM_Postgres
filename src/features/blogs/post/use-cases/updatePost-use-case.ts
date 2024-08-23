import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../post.repository';
import { PostInputModel } from '../DTOs/input/PostInputModel.dto';

export class UpdatePostCommand {
  constructor(
    public id: string,
    public dto: PostInputModel,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand) {
    return await this.postRepository.updatePost(command.id, command.dto);
  }
}
