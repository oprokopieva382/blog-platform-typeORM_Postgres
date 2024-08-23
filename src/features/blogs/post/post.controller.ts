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
import { CommandBus } from '@nestjs/cqrs';
import { PostInputModel } from './DTOs/input/PostInputModel.dto';
import { PostService } from './post.service';
import { PostQueryRepository } from './post.query.repository';
import { PostQueryModel } from './DTOs/input/PostQueryModel.dto';
import { baseQueryFilter } from 'src/base/utils/queryFilter';
import { TransformPost } from './DTOs/output/TransformPost';
import { CommentInputModel } from '../comment/DTOs/input/CommentInputModel.dto';
import { TransformComment } from '../comment/DTOs/output/TransformComment';
import { LikeInputModel } from 'src/base/DTOs/input/LikeInputModel.dto';
import { CreatePostCommand } from './use-cases/createPost-use-case';
import { UpdatePostCommand } from './use-cases/updatePost-use-case';
import { DeletePostCommand } from './use-cases/deletePost-use-case';
import { CreatePostCommentCommand } from './use-cases/createPostComment-use-case';
import { OptionalJwtAuthGuard } from 'src/features/auth-users/auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from 'src/features/auth-users/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/features/auth-users/auth/guards/admin-auth.guard';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly TransformComment: TransformComment,
    private readonly TransformPost: TransformPost,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  async getPosts(@Query() query: PostQueryModel, @Request() req) {
    return await this.postQueryRepository.getPosts(
      baseQueryFilter(query),
      req?.user?.id,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getByIdPost(@Param('id') id: string, @Request() req) {
    const result = await this.postQueryRepository.getByIdPost(id);
    if (!result) {
      throw new NotFoundException();
    }
    return await this.TransformPost.transformToViewModel(result, req?.user?.id);
  }

  @Get(':postId/comments')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostComments(
    @Query() query: PostQueryModel,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    const result = await this.postQueryRepository.getPostComments(
      postId,
      baseQueryFilter(query),
      req?.user?.id,
    );
    if (result.items.length === 0 || !result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  async createPostComment(
    @Body() dto: CommentInputModel,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    const result = await this.commandBus.execute(
      new CreatePostCommentCommand(postId, dto.content, req.user),
    );

    if (!result) {
      throw new NotFoundException();
    }

    return this.TransformComment.transformToViewModel(result);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async createPost(@Body() dto: PostInputModel) {
    const result = await this.commandBus.execute(new CreatePostCommand(dto));
    return this.TransformPost.transformToViewModel(result);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async updatePost(@Param('id') id: string, @Body() dto: PostInputModel) {
    const result = await this.commandBus.execute(
      new UpdatePostCommand(id, dto),
    );
    if (!result) {
      throw new NotFoundException();
    }
  }

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async reactToPost(
    @Param('postId') postId: string,
    @Body() dto: LikeInputModel,
    @Request() req,
  ) {
    const result = await this.postService.reactToPost(
      postId,
      dto.likeStatus,
      req.user,
    );
    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeletePostCommand(id));
    if (!result) {
      throw new NotFoundException();
    }
  }
}
