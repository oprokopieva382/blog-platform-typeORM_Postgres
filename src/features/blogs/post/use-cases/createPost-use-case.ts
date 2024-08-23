import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../post.repository';
import { PostInputModel } from '../DTOs/input/PostInputModel.dto';

export class CreatePostCommand {
  constructor(public dto: PostInputModel) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommand) {
    const postDto = {
      ...command.dto,
      blog: command.dto.blogId,
      createdAt: new Date().toISOString(),
    };

    return await this.postRepository.createPost(postDto);
  }
}
