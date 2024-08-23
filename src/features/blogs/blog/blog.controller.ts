import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogInputModel } from './DTOs/input/BlogInputModel.dto';
import { BlogPostInputModel } from './DTOs/input/BlogPostInputModel';
import {
  BlogPostQueryModel,
  BlogQueryModel,
} from './DTOs/input/BlogQueryModel.dto';
import { BlogQueryRepository } from './blog.query.repository';
import { blogQueryFilter } from 'src/base/utils/queryFilter';
import { TransformPost } from '../post/DTOs/output/TransformPost';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogPostCommand } from './use-cases/createBlogPost-use-case';
import { CreateBlogCommand } from './use-cases/createBlog-use-case';
import { UpdateBlogCommand } from './use-cases/updateBlog-use-case';
import { DeleteBlogCommand } from './use-cases/deleteBlog-use-case';
import { TransformBlog } from './DTOs/output/TransformBlog';
import { OptionalJwtAuthGuard } from 'src/features/auth-users/auth/guards/optional-jwt-auth.guard';
import { AdminAuthGuard } from 'src/features/auth-users/auth/guards/admin-auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogQueryRepository: BlogQueryRepository,
    private readonly TransformPost: TransformPost,
    private readonly TransformBlog: TransformBlog,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogQueryModel) {
    return await this.blogQueryRepository.getBlogs(blogQueryFilter(query));
  }

  @Get(':id')
  async getByIdBlog(@Param('id') id: string) {
    const result = await this.blogQueryRepository.getByIdBlog(id);
    if (!result) {
      throw new NotFoundException();
    }
    return this.TransformBlog.transformToViewModel(result);
  }

  @Get(':blogId/posts')
  @UseGuards(OptionalJwtAuthGuard)
  async getBlogPosts(
    @Query() query: BlogPostQueryModel,
    @Param('blogId') blogId: string,
    @Request() req,
  ) {
    const result = await this.blogQueryRepository.getBlogPosts(
      blogId,
      blogQueryFilter(query),
      req?.user?.id,
    );
    if (result.items.length === 0) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post(':blogId/posts')
  @UseGuards(AdminAuthGuard)
  async createBlogPost(
    @Param('blogId') blogId: string,
    @Body() dto: BlogPostInputModel,
  ) {
    const result = await this.commandBus.execute(
      new CreateBlogPostCommand(blogId, dto),
    );
    return this.TransformPost.transformToViewModel(result);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async createBlog(@Body() dto: BlogInputModel) {
    const result = await this.commandBus.execute(new CreateBlogCommand(dto));
    return this.TransformBlog.transformToViewModel(result);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() dto: BlogInputModel) {
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(id, dto),
    );
    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeleteBlogCommand(id));
    if (!result) {
      throw new NotFoundException();
    }
  }
}
