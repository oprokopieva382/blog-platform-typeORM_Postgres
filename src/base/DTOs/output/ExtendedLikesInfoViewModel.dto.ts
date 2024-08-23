import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LikeStatus } from '../../enum/LikesStatus';
import { LikeDetailsViewModel } from './LikeDetailsViewModel.dto';

export class ExtendedLikesInfoViewModel {
  @IsNumber()
  @IsOptional()
  likesCount: number;

  @IsNumber()
  @IsOptional()
  dislikesCount: number;

  @IsEnum(LikeStatus)
  @IsOptional()
  myStatus: LikeStatus;

  @IsOptional()
  newestLikes: LikeDetailsViewModel[] | [];
}
