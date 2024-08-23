import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog } from 'src/features/blogs/blog/schemas/Blog.schema';
import { PostReaction } from './PostReaction.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
  blog: Blog;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostReaction',
      default: [],
    },
  ])
  reactionInfo: PostReaction[];

  @Prop({ required: true, default: 0, min: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0, min: 0 })
  dislikesCount: number;

  @Prop({ required: true })
  createdAt: Date;
}

//if need to add class methods in future
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
