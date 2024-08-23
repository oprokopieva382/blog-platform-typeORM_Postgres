import { CommentDocument } from '../../schemas/Comment.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { Injectable } from '@nestjs/common';
import { CommentQueryRepository } from '../../comment.query.repository';
import { CommentViewModel } from './CommentViewModel';

@Injectable()
export class TransformComment {
  constructor(
    private readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  async transformToViewModel(
    comment: CommentDocument,
    userId?: string,
  ): Promise<CommentViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;

    if (userId) {
      const myStatus = (await this.commentQueryRepository.getReactionStatus(
        userId,
        comment._id.toString(),
      )) as any;
      userStatus = myStatus ? myStatus.status : LikeStatus.None;
    }

    
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: userStatus,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
