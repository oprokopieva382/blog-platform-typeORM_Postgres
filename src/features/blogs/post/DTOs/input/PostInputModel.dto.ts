import { IsBlogIdExist } from "src/base/decorators/isBlogIdExist";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Trim } from "src/base/decorators/trim";

export class PostInputModel {
  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(100)
  shortDescription: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsBlogIdExist({ message: 'Invalid blog ID' })
  @Trim()
  @IsString()
  blogId: string;
}
