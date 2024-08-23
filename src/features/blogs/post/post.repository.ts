import { Injectable } from '@nestjs/common';
import { PostInputModel } from './DTOs/input/PostInputModel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/Post.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Comment, CommentDocument } from '../comment/schemas/Comment.schema';
import {
  PostReaction,
  PostReactionDocument,
} from './schemas/PostReaction.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(PostReaction.name)
    private PostReactionModel: Model<PostReactionDocument>,
  ) {}

  async getByIdPost(id: string) {
    return await this.PostModel.findById(id).populate('blog');
  }

  async getReactionStatus(userId: string, postId: string) {
    return this.PostReactionModel.findOne({ user: userId, post: postId });
  }

  async createDefaultReaction(userId: string, postId: string) {
    await this.PostReactionModel.create({
      user: userId,
      myStatus: LikeStatus.None,
      post: postId,
      createdAt: new Date().toISOString(),
    });
  }

  async dislikePost(postId: string, count: number) {
    return await this.PostModel.findByIdAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $inc: { dislikesCount: count },
      },
      { new: true },
    );
  }

  async likePost(postId: string, count: number) {
    return await this.PostModel.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $inc: { likesCount: count },
      },
      { new: true },
    );
  }

  async updateMyReaction(userId: string, postId: string, myStatus: LikeStatus) {
    return await this.PostReactionModel.findOneAndUpdate(
      { user: userId, post: postId },
      {
        $set: { myStatus },
      },
      { new: true },
    );
  }

  async addLikedUser(userId: string, createdAt: string, postId: string) {
    const result = await this.PostReactionModel.findOneAndUpdate(
      { user: userId, post: postId },
      {
        $push: {
          latestReactions: {
            user: userId,
            addedAt: createdAt,
            //description: "random",
          },
        },
      },
      { new: true, upsert: true },
    ).populate('latestReactions.user', 'login _id');
    console.log('addLikeUser in repository', result);
    return result;
  }

  async createPost(dto: PostInputModel) {
    const newPost = new this.PostModel(dto);
    return (await newPost.save()).populate('blog');
  }

  async createComment(comment: any) {
    const newComment = new this.CommentModel(comment);
    return (await newComment.save()).populate('post');
  }

  async updatePost(id: string, dto: PostInputModel) {
    return await this.PostModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deletePost(id: string) {
    return await this.PostModel.findByIdAndDelete(id);
  }
}
