import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../blog.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: DeleteBlogCommand) {
    return await this.blogRepository.deleteBlog(command.id);
  }
}
