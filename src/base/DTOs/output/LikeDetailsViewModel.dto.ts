import { IsOptional, IsString } from 'class-validator';

export class LikeDetailsViewModel {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  login: string;

  @IsString()
  @IsOptional()
  addedAt: Date;
}
