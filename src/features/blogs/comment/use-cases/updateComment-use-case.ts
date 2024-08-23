import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../comment.repository';
import { CommentInputModel } from '../DTOs/input/CommentInputModel.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public dto: CommentInputModel,
    public user: any,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentRepository.getByIdComment(
      command.commentId,
    );

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment && command.user.id !== comment.commentatorInfo.userId) {
      throw new ForbiddenException();
    }

    return await this.commentRepository.updateComment(
      command.commentId,
      command.dto,
    );
  }
}
