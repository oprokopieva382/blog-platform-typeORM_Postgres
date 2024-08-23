import { IsString, IsEnum } from 'class-validator';
import { LikeStatus } from 'src/base/enum/LikesStatus';

export class LikeInputModel {
  @IsEnum(LikeStatus)
  @IsString()
  likeStatus: LikeStatus;
}
