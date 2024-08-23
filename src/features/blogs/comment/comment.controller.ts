import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { CommentQueryRepository } from './comment.query.repository';
import { TransformComment } from './DTOs/output/TransformComment';
import { CommentInputModel } from './DTOs/input/CommentInputModel.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from './use-cases/updateComment-use-case';
import { DeleteCommentCommand } from './use-cases/deleteComment-use-case';
import { LikeInputModel } from 'src/base/DTOs/input/LikeInputModel.dto';
import { ReactToCommentCommand } from './use-cases/reactToComment-use-case';
import { OptionalJwtAuthGuard } from 'src/features/auth-users/auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from 'src/features/auth-users/auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentQueryRepository: CommentQueryRepository,
    private readonly TransformComment: TransformComment,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getByIdComment(@Param('id') id: string, @Request() req) {
    const result = await this.commentQueryRepository.getByIdComment(id);
    if (!result) {
      throw new NotFoundException();
    }
    return this.TransformComment.transformToViewModel(result, req?.user?.id);
  }

  @Put(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: CommentInputModel,
    @Request() req,
  ) {
    const result = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, dto, req.user),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return this.TransformComment.transformToViewModel(result);
  }

  @Put(':commentId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async reactToComment(
    @Param('commentId') commentId: string,
    @Body() dto: LikeInputModel,
    @Request() req,
  ) {
    const result = await this.commandBus.execute(
      new ReactToCommentCommand(commentId, dto, req.user),
    );
    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteComment(@Param('commentId') commentId: string, @Request() req) {
    const result = await this.commandBus.execute(
      new DeleteCommentCommand(commentId, req.user),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return this.TransformComment.transformToViewModel(result);
  }
}
