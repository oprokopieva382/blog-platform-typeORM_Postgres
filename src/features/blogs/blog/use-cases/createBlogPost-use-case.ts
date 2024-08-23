import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '../blog.repository';
import { BlogPostInputModel } from '../DTOs/input/BlogPostInputModel';
import { NotFoundException } from '@nestjs/common';

export class CreateBlogPostCommand {
  constructor(
    public blogId: string,
    public dto: BlogPostInputModel,
  ) {}
}

@CommandHandler(CreateBlogPostCommand)
export class CreateBlogPostUseCase
  implements ICommandHandler<CreateBlogPostCommand>
{
  constructor(private readonly blogRepository: BlogRepository) {}

  async execute(command: CreateBlogPostCommand) {
    const blog = await this.blogRepository.getByIdBlog(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const postDto = {
      ...command.dto,
      blog: command.blogId,
      likesCount: 0,
      dislikesCount: 0,
      reactionInfo: [],
      createdAt: new Date(),
    };

    return await this.blogRepository.createBlogPost(postDto);
  }
}
