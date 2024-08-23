import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ default: false, required: true })
  isMembership: string;

  @Prop({ required: true })
  //createdAt: Date;
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);
