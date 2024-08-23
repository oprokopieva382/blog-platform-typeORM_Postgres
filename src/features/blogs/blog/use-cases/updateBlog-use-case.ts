import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../blog.repository';
import { BlogInputModel } from '../DTOs/input/BlogInputModel.dto';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: BlogInputModel,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: UpdateBlogCommand) {
    return await this.blogRepository.updateBlog(command.id, command.dto);
  }
}
