import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../comment.repository';
import { NotFoundException } from '@nestjs/common';
import { LikeInputModel } from 'src/base/DTOs/input/LikeInputModel.dto';
import { CommentService } from '../comment.service';

export class ReactToCommentCommand {
  constructor(
    public commentId: string,
    public dto: LikeInputModel,
    public user: any,
  ) {}
}

@CommandHandler(ReactToCommentCommand)
export class ReactToCommentUseCase implements ICommandHandler<ReactToCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentService: CommentService,
  ) {}

  async execute(command: ReactToCommentCommand) {
    const comment = await this.commentRepository.getByIdComment(
      command.commentId,
    );

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.reactToComment(
      command.dto,
      command.commentId,
      command.user,
    );
  }
}
