import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/Blog.schema';
import mongoose, { Model } from 'mongoose';
import {
  BlogPostQueryModel,
  BlogQueryModel,
} from './DTOs/input/BlogQueryModel.dto';
import { PaginatorModel } from 'src/base/DTOs/output/Paginator.dto';
import { BlogViewModel } from './DTOs/output/BlogViewModel.dto';
import { Post, PostDocument } from '../post/schemas/Post.schema';
import { SortDirection } from 'src/base/enum/SortDirection';
import { PostViewModel } from '../post/DTOs/output/PostViewModel.dto';
import { TransformPost } from '../post/DTOs/output/TransformPost';
import { TransformBlog } from './DTOs/output/TransformBlog';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    private readonly TransformPost: TransformPost,
    private readonly TransformBlog: TransformBlog,
  ) {}

  async getBlogs(
    query: BlogQueryModel,
  ): Promise<PaginatorModel<BlogViewModel>> {
    const search = query.searchNameTerm
      ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
      : {};

    const totalBlogsCount = await this.BlogModel.countDocuments({
      ...search,
    });

    const blogs = await this.BlogModel.find(search)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({
        [query.sortBy]:
          query.sortDirection === '1' ? SortDirection.asc : SortDirection.desc,
      });

    const blogsToView = {
      pagesCount: Math.ceil(totalBlogsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalBlogsCount,
      items: await Promise.all(
        blogs.map((b) => this.TransformBlog.transformToViewModel(b)),
      ),
    };

    return blogsToView;
  }

  async getByIdBlog(id: string) {
    return await this.BlogModel.findById(id);
  }

  async getBlogPosts(
    blogId: string,
    query: BlogPostQueryModel,
    userId?: string,
  ): Promise<PaginatorModel<PostViewModel>> {
    const totalPostsCount = await this.PostModel.countDocuments({
      blog: blogId.toString(),
    });

    const sortDirection =
      query.sortDirection === '1' ? SortDirection.asc : SortDirection.desc;

    const sortField = query.sortBy === 'blogName' ? 'blog.name' : query.sortBy;

    const aggregationPipeline = [
      {
        $match: { blog: new mongoose.Types.ObjectId(blogId) },
      },
      {
        $lookup: {
          from: 'blogs', // collection name in MongoDB
          localField: 'blog',
          foreignField: '_id',
          as: 'blog',
        },
      },
      {
        $unwind: '$blog',
      },
      {
        $lookup: {
          from: 'postreactions', // collection name in MongoDB
          localField: 'reactionInfo',
          foreignField: 'post',
          as: 'reactionInfo',
        },
      },
      {
        $sort: {
          [sortField]: sortDirection === SortDirection.asc ? 1 : -1,
        },
      },
      {
        $skip: (query.pageNumber - 1) * query.pageSize,
      },
      {
        $limit: query.pageSize,
      },
    ] as any;

    const posts = await this.PostModel.aggregate(aggregationPipeline);
    console.log('posts', posts);

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: await Promise.all(
        posts.map((p) => this.TransformPost.transformToViewModel(p, userId)),
      ),
    };
    console.log('post to view', postsToView);
    return postsToView;
  }
}
