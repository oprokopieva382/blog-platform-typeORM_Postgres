import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/features/auth-users/user/schemas/User.schema';
import { Post } from './Post.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';

//*LatestReaction Schema
@Schema()
export class LatestReaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user?: string | null;

  @Prop({ type: String, required: true, default: new Date().toISOString() })
  addedAt: string;
}

const LatestReactionSchema = SchemaFactory.createForClass(LatestReaction);

export type PostReactionDocument = HydratedDocument<PostReaction>;

//*PostReaction Schema
@Schema()
export class PostReaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user?: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false })
  post?: Post;

  @Prop({
    type: String,
    enum: LikeStatus,
    default: LikeStatus.None,
    required: true,
  })
  myStatus: string;

  @Prop({ type: [LatestReactionSchema], default: [] })
  latestReactions: LatestReaction[];

  @Prop({ default: new Date(), required: true })
  createdAt: Date;
}

export const PostReactionSchema = SchemaFactory.createForClass(PostReaction);
