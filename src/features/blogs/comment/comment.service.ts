import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { LikeInputModel } from 'src/base/DTOs/input/LikeInputModel.dto';

@Injectable()
export class CommentService {
  constructor(protected commentRepository: CommentRepository) {}

  private async likeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId,
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.status);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      return true;
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus,
      );
      await this.commentRepository.dislikeComment(commentId, -1);
      return await this.commentRepository.likeComment(commentId, 1);
    }

    await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus,
    );
    return await this.commentRepository.likeComment(commentId, 1);
  }

  private async dislikeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId,
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.status);

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      return true;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus,
      );
      await this.commentRepository.likeComment(commentId, -1);
      return await this.commentRepository.dislikeComment(commentId, 1);
    }

    await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus,
    );
    return await this.commentRepository.dislikeComment(commentId, 1);
  }

  private async noneComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.commentRepository.getReactionStatus(
      userId,
      commentId,
    )) as any;

    !reaction
      ? await this.commentRepository.createDefaultReaction(userId, commentId)
      : (myStatus = reaction.status);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.None) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        likeStatus,
      );
      return await this.commentRepository.likeComment(commentId, -1);
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.None) {
      await this.commentRepository.updateMyReaction(
        userId,
        commentId,
        LikeStatus.None,
      );
      return await this.commentRepository.dislikeComment(commentId, -1);
    }

    return await this.commentRepository.updateMyReaction(
      userId,
      commentId,
      likeStatus,
    );
  }

  async reactToComment(data: LikeInputModel, commentId: string, user: any) {
    const comment = await this.commentRepository.getByIdComment(commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    const { likeStatus } = data;
    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likeComment(commentId, likeStatus, user.id);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikeComment(commentId, likeStatus, user.id);
        break;
      case LikeStatus.None:
        result = await this.noneComment(commentId, likeStatus, user.id);
        break;
      default:
        throw new BadRequestException();
    }

    return result;
  }
}
