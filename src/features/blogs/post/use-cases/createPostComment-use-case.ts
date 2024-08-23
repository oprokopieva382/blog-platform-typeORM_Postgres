import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../post.repository';
import { NotFoundException } from '@nestjs/common';

export class CreatePostCommentCommand {
  constructor(public postId: string, public content: string, public user: any) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentUseCase implements ICommandHandler<CreatePostCommentCommand> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommentCommand) {
    const post = await this.postRepository.getByIdPost(command.postId);

    if (!post) {
      throw new NotFoundException();
    }

    const newComment = {
      post: command.postId,
      content: command.content,
      commentatorInfo: {
        userId: command.user.id,
        userLogin: command.user.login,
      },
      likesCount: 0,
      dislikesCount: 0,
      myStatus: [],
      createdAt: new Date().toISOString(),
    };
    return await this.postRepository.createComment(newComment);
  }
}
