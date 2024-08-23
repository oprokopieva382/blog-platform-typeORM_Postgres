import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/Post.schema';
import { Model } from 'mongoose';
import { PostQueryModel } from './DTOs/input/PostQueryModel.dto';
import { PaginatorModel } from 'src/base/DTOs/output/Paginator.dto';
import { PostViewModel } from './DTOs/output/PostViewModel.dto';
import { Comment, CommentDocument } from '../comment/schemas/Comment.schema';
import { SortDirection } from 'src/base/enum/SortDirection';
import { TransformComment } from '../comment/DTOs/output/TransformComment';
import {
  PostReaction,
  PostReactionDocument,
} from './schemas/PostReaction.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { TransformPost } from './DTOs/output/TransformPost';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Comment.name) private CommentModel: Model<CommentDocument>,
    @InjectModel(PostReaction.name)
    private PostReactionModel: Model<PostReactionDocument>,
    @Inject(forwardRef(() => TransformComment))
    private readonly TransformComment: TransformComment,
    @Inject(forwardRef(() => TransformPost))
    private readonly TransformPost: TransformPost,
  ) {}

  async getReactionStatus(userId: string, postId: string) {
    const MyReaction = await this.PostReactionModel.findOne({
      user: userId,
      post: postId,
    });
   
    return MyReaction;
  }

  async getPostReactionsInfo(postId: string) {
    return await this.PostReactionModel.find({
      post: postId,
      myStatus: LikeStatus.Like,
    }).populate({
      path: 'latestReactions.user',
      select: ['login', '_id'],
    });
  }

  async getPosts(
    query: PostQueryModel,
    userId?: string,
  ): Promise<PaginatorModel<PostViewModel>> {
    const totalPostsCount = await this.PostModel.countDocuments();

    const sortDirection =
      query.sortDirection === '1' ? SortDirection.asc : SortDirection.desc;

    const sortField = query.sortBy === 'blogName' ? 'blog.name' : query.sortBy;

    const aggregationPipeline = [
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
        $sort: {
          [sortField]: sortDirection,
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

    const postsToView = {
      pagesCount: Math.ceil(totalPostsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalPostsCount,
      items: await Promise.all(
        posts.map((post) =>
          this.TransformPost.transformToViewModel(post, userId),
        ),
      ),
    };

    return postsToView;
  }

  async getByIdPost(id: string) {
    return await this.PostModel.findById(id).populate('blog');
  }

  async getPostComments(
    postId: string,
    query: PostQueryModel,
    userId?: string,
  ) {
    const totalCommentsCount = await this.CommentModel.countDocuments({
      post: postId.toString(),
    });

    const comments = await this.CommentModel.find({
      post: postId.toString(),
    })
      //update in future with aggregate if sort will be needed
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .populate('post', '_id')
      .populate({ path: 'myStatus', select: 'status' })
      .sort({
        [query.sortBy]:
          query.sortDirection === '1' ? SortDirection.asc : SortDirection.desc,
      });

    console.log('Found comments', comments);

    const commentsToView = {
      pagesCount: Math.ceil(totalCommentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCommentsCount,
      items: await Promise.all(
        comments.map((c) =>
          this.TransformComment.transformToViewModel(c, userId),
        ),
      ),
    };
    console.log('Found commentsToView', commentsToView);
    return commentsToView;
  }
}
