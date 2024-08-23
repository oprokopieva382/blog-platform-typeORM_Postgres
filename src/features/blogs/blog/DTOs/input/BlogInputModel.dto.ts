import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../../base/decorators/trim';

export class BlogInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
