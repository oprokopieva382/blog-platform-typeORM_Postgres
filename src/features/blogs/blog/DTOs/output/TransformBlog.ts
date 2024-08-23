import { Injectable } from '@nestjs/common';
import { BlogDocument } from 'src/features/blogs/blog/schemas/Blog.schema';
import { BlogViewModel } from './BlogViewModel.dto';

@Injectable()
export class TransformBlog {
  constructor() {}

  async transformToViewModel(blog: BlogDocument): Promise<BlogViewModel> {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: false,
      createdAt: blog.createdAt.toISOString(),
    };
  }
}
