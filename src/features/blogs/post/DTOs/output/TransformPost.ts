import {  forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostQueryRepository } from '../../post.query.repository';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { PostDocument } from '../../schemas/Post.schema';
import { PostViewModel } from './PostViewModel.dto';
import { LikeDetailsViewModel } from 'src/base/DTOs/output/LikeDetailsViewModel.dto';
import { sortLikes } from 'src/base/utils/sortLikes';
import mongoose from 'mongoose';
import { Blog } from 'src/features/blogs/blog/schemas/Blog.schema';

export interface PopulatedBlog extends Blog {
  _id: mongoose.Types.ObjectId;
}

@Injectable()
export class TransformPost {
  constructor(
    @Inject(forwardRef(() => PostQueryRepository))
    private readonly postQueryRepository: PostQueryRepository,
  ) {}

  async transformToViewModel(
    post: PostDocument,
    userId?: string,
  ): Promise<PostViewModel> {
    let userStatus: LikeStatus = LikeStatus.None;
    let newestLikes: LikeDetailsViewModel[] = [];

    if (userId) {
      const reactionInfo = (await this.postQueryRepository.getReactionStatus(
        userId,
        post._id.toString(),
      )) as any;
      userStatus = reactionInfo ? reactionInfo.myStatus : LikeStatus.None;
    }

    const postReactionsInfo =
      await this.postQueryRepository.getPostReactionsInfo(post._id.toString());

    const sortedLikes = sortLikes(postReactionsInfo);

    sortedLikes.map((like: any) => {
      newestLikes.push({
        userId: like.user._id.toString(),
        login: like.user.login,
        //description: like.description,
        addedAt: like.addedAt,
      });
    });

    const blog = post.blog as PopulatedBlog;
    //console.log('post', post);

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: userStatus,
        newestLikes: newestLikes,
      },
    };
  }
}
