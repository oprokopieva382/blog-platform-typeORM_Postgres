import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/schemas/Blog.schema';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/blog.service';
import { BlogRepository } from './blog/blog.repository';
import { BlogQueryRepository } from './blog/blog.query.repository';
import { Post, PostSchema } from './post/schemas/Post.schema';
import {
  PostReaction,
  PostReactionSchema,
} from './post/schemas/PostReaction.schema';
import { TransformPost } from './post/DTOs/output/TransformPost';
import { PostQueryRepository } from './post/post.query.repository';
import { Comment, CommentSchema } from './comment/schemas/Comment.schema';
import { TransformComment } from './comment/DTOs/output/TransformComment';
import { CommentQueryRepository } from './comment/comment.query.repository';
import {
  CommentReaction,
  CommentReactionSchema,
} from './comment/schemas/CommentReaction.schema';
import { CreateBlogPostUseCase } from './blog/use-cases/createBlogPost-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './blog/use-cases/createBlog-use-case';
import { UpdateBlogUseCase } from './blog/use-cases/updateBlog-use-case';
import { DeleteBlogUseCase } from './blog/use-cases/deleteBlog-use-case';
import { TransformBlog } from './blog/DTOs/output/TransformBlog';
import { IsBlogIdExistConstraint } from 'src/base/utils/validateBlogId';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostRepository } from './post/post.repository';
import { CreatePostUseCase } from './post/use-cases/createPost-use-case';
import { UpdatePostUseCase } from './post/use-cases/updatePost-use-case';
import { DeletePostUseCase } from './post/use-cases/deletePost-use-case';
import { CreatePostCommentUseCase } from './post/use-cases/createPostComment-use-case';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentRepository } from './comment/comment.repository';
import { UpdateCommentUseCase } from './comment/use-cases/updateComment-use-case';
import { DeleteCommentUseCase } from './comment/use-cases/deleteComment-use-case';
import { ReactToCommentUseCase } from './comment/use-cases/reactToComment-use-case';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: CommentReaction.name,
        schema: CommentReactionSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: PostReaction.name,
        schema: PostReactionSchema,
      },
    ]),
  ],
  controllers: [BlogController, PostController, CommentController],
  providers: [
    BlogService,
    PostService,
    CommentService,
    BlogRepository,
    PostRepository,
    CommentRepository,
    BlogQueryRepository,
    PostQueryRepository,
    CommentQueryRepository,
    CreateBlogPostUseCase,
    CreateBlogUseCase,
    CreatePostUseCase,
    UpdateBlogUseCase,
    UpdatePostUseCase,
    UpdateCommentUseCase,
    DeleteBlogUseCase,
    DeletePostUseCase,
    DeleteCommentUseCase,
    ReactToCommentUseCase,
    CreatePostCommentUseCase,
    TransformPost,
    TransformComment,
    TransformBlog,
    IsBlogIdExistConstraint,
  ],
})
export class BlogModule {}
