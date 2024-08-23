import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { LikeStatus } from 'src/base/enum/LikesStatus';

@Injectable()
export class PostService {
  constructor(protected postRepository: PostRepository) {}

  private async likePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId,
    )) as any;

    !reaction
      ? await this.postRepository.createDefaultReaction(userId, postId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Like) {
      return true;
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      await this.postRepository.dislikePost(postId, -1);
      await this.postRepository.likePost(postId, 1);

      return await this.postRepository.addLikedUser(
        userId,
        new Date().toISOString(),
        postId,
      );
    }

    await this.postRepository.updateMyReaction(userId, postId, likeStatus);
    await this.postRepository.likePost(postId, 1);

    return await this.postRepository.addLikedUser(
      userId,
      new Date().toISOString(),
      postId,
    );
  }

  private async dislikePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId,
    )) as any;

    !reaction
      ? await this.postRepository.createDefaultReaction(userId, postId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Dislike) {
      return true;
    }

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      await this.postRepository.likePost(postId, -1);
      return await this.postRepository.dislikePost(postId, 1);
    }

    await this.postRepository.updateMyReaction(userId, postId, likeStatus);
    return await this.postRepository.dislikePost(postId, 1);
  }

  private async nonePost(
    postId: string,
    likeStatus: LikeStatus,
    userId: string,
  ) {
    let myStatus;

    const reaction = (await this.postRepository.getReactionStatus(
      userId,
      postId,
    )) as any;

    !reaction
      ? await this.postRepository.createDefaultReaction(userId, postId)
      : (myStatus = reaction.myStatus);

    if (myStatus === LikeStatus.Like && likeStatus === LikeStatus.None) {
      await this.postRepository.updateMyReaction(userId, postId, likeStatus);
      return await this.postRepository.likePost(postId, -1);
    }

    if (myStatus === LikeStatus.Dislike && likeStatus === LikeStatus.None) {
      await this.postRepository.updateMyReaction(
        userId,
        postId,
        LikeStatus.None,
      );
      return await this.postRepository.dislikePost(postId, -1);
    }

    return await this.postRepository.updateMyReaction(
      userId,
      postId,
      likeStatus,
    );
  }

  async reactToPost(postId: string, likeStatus: LikeStatus, user: any) {
    const post = await this.postRepository.getByIdPost(postId);

    if (!post) {
      throw new NotFoundException();
    }

    let result;

    switch (likeStatus) {
      case LikeStatus.Like:
        result = await this.likePost(postId, likeStatus, user.id);
        break;
      case LikeStatus.Dislike:
        result = await this.dislikePost(postId, likeStatus, user.id);
        break;
      case LikeStatus.None:
        result = await this.nonePost(postId, likeStatus, user.id);
        break;
      default:
        throw new BadRequestException();
    }

    return result;
  }
}
