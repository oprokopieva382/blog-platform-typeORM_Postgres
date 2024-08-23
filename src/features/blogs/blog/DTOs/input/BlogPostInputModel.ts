import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class BlogPostInputModel {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(100)
  content: string;
}
