import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInputModel } from './DTOs/input/UserInputModel.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserRepositoryPostgres {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: UserInputModel) {
    // const newUser = new this.UserModel(dto);
    // return await newUser.save();
  }

  async deleteUser(id: string) {
    //return await this.UserModel.findByIdAndDelete(id);
  }
}
