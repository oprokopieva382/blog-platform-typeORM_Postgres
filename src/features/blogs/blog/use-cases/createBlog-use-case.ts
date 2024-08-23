import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../blog.repository';
import { BlogInputModel } from '../DTOs/input/BlogInputModel.dto';

export class CreateBlogCommand {
  constructor(public dto: BlogInputModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: CreateBlogCommand) {
    const blogDto = {
      ...command.dto,
      createdAt: new Date().toISOString(),
    };
    return await this.blogRepository.createBlog(blogDto);
  }
}
