import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LikeStatus } from '../../enum/LikesStatus';

export class LikesInfoViewModel {
  @IsNumber()
  @IsOptional()
  likesCount: number;

  @IsNumber()
  @IsOptional()
  dislikesCount: number;

  @IsEnum(LikeStatus)
  @IsOptional()
  myStatus: LikeStatus;
}
