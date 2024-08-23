import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { Comment } from './Comment.schema';
import { User } from 'src/features/auth-users/user/schemas/User.schema';

export type CommentReactionDocument = HydratedDocument<CommentReaction>;

@Schema()
export class CommentReaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  })
  comment: Comment;

  @Prop({
    type: String,
    enum: Object.values(LikeStatus),
    default: LikeStatus.None,
    required: true,
  })
  status: string;
}

export const CommentReactionSchema =
  SchemaFactory.createForClass(CommentReaction);
