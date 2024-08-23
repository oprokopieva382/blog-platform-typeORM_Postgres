import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ExtendedLikesInfoViewModel } from 'src/base/DTOs/output/ExtendedLikesInfoViewModel.dto';

export class PostViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  blogId: string;

  @IsNotEmpty()
  @IsString()
  blogName: string;

  @IsNotEmpty()
  @IsString()
  extendedLikesInfo: ExtendedLikesInfoViewModel;

  @IsNotEmpty()
  @IsOptional()
  createdAt?: string;
}

