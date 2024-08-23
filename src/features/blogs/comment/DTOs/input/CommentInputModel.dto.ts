import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class CommentInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(300)
  @MinLength(20)
  content: string;
}
