import { Injectable } from '@nestjs/common';
import { BlogInputModel } from './DTOs/input/BlogInputModel.dto';
import { BlogPostInputModel } from './DTOs/input/BlogPostInputModel';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/Blog.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/schemas/Post.schema';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async getByIdBlog(id: string) {
    return await this.BlogModel.findById(id);
  }

  async createBlogPost(dto: BlogPostInputModel) {
    const newPost = new this.PostModel(dto);
    return (await newPost.save()).populate('blog');
  }

  async createBlog(dto: BlogInputModel) {
    const newBlog = new this.BlogModel(dto);
    return await newBlog.save();
  }

  async updateBlog(id: string, dto: BlogInputModel) {
    return await this.BlogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteBlog(id: string) {
    return await this.BlogModel.findByIdAndDelete(id);
  }
}
