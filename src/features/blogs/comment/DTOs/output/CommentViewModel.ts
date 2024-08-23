import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LikesInfoViewModel } from 'src/base/DTOs/output/LikesInfoViewModel.dto';
import { CommentDocument } from '../../schemas/Comment.schema';
import { LikeStatus } from 'src/base/enum/LikesStatus';
import { Injectable } from '@nestjs/common';
import { CommentQueryRepository } from '../../comment.query.repository';

class CommentatorInfo {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userLogin: string;
}
export class CommentViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  commentatorInfo: CommentatorInfo;

  @IsNotEmpty()
  likesInfo: LikesInfoViewModel;

  @IsNotEmpty()
  @IsOptional()
  createdAt?: string;
}
