import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../comment.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public user: any,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentRepository.getByIdComment(
      command.commentId,
    );

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment && command.user.id !== comment.commentatorInfo.userId) {
      throw new ForbiddenException();
    }

    return await this.commentRepository.deleteComment(
      command.commentId
    );
  }
}
