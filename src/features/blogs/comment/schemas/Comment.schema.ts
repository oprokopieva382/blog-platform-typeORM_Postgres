import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/features/blogs/post/schemas/Post.schema';
import { CommentReaction } from './CommentReaction.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommentReaction',
        required: true,
      },
    ],
  })
  myStatus: CommentReaction[];

  @Prop({ required: true, default: 0, min: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0, min: 0 })
  dislikesCount: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);
