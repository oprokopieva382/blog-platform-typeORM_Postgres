import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/Comment.schema';
import { CommentInputModel } from './DTOs/input/CommentInputModel.dto';
import {
  CommentReaction,
  CommentReactionDocument,
} from './schemas/CommentReaction.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(CommentReaction.name)
    private CommentReactionModel: Model<CommentReactionDocument>,
  ) {}

  async getByIdComment(id: string) {
    return await this.CommentModel.findById(id).populate({
      path: 'myStatus',
      select: 'status',
    });
  }

  async getReactionStatus(userId: string, commentId: string) {
    return this.CommentReactionModel.findOne({
      user: userId,
      comment: commentId,
    });
  }

  async createDefaultReaction(userId: string, commentId: string) {
    await this.CommentReactionModel.create({
      _id: new ObjectId(),
      user: userId,
      status: LikeStatus.None,
      comment: commentId,
      createdAt: new Date().toISOString(),
    });
  }

  async updateMyReaction(
    userId: string,
    commentId: string,
    status: LikeStatus,
  ) {
    return await this.CommentReactionModel.findOneAndUpdate(
      { user: userId, comment: commentId },
      {
        $set: { status },
      },
      { new: true },
    );
  }

  async dislikeComment(commentId: string, count: number) {
    return await this.CommentModel.findByIdAndUpdate(
      { _id: new ObjectId(commentId) },
      {
        $inc: { dislikesCount: count },
      },
      { new: true },
    );
  }

  async likeComment(commentId: string, count: number) {
    return await this.CommentModel.findOneAndUpdate(
      { _id: commentId },
      {
        $inc: { likesCount: count },
      },
      { new: true },
    );
  }

  async updateComment(commentId: string, dto: CommentInputModel) {
    return await this.CommentModel.findByIdAndUpdate(commentId, dto, {
      new: true,
    });
  }

  async deleteComment(commentId: string) {
    return await this.CommentModel.findByIdAndDelete(commentId);
  }
}
