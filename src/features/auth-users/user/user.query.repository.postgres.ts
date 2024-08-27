import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserQueryModel } from './DTOs/input/UserQueryModel.dto';
import { PaginatorModel } from 'src/base/DTOs/output/Paginator.dto';
import { UserViewModel } from './DTOs/output/UserViewModel.dto';
import { SortDirection } from 'src/base/enum/SortDirection';
import { TransformUser } from './DTOs/output/TransformUser';
import { transformToViewUser } from '../auth/DTOs/output/MeViewModel.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UserQueryRepositoryPostgres {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly TransformUser: TransformUser,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getUsers(
    query: UserQueryModel,
  ): Promise<PaginatorModel<UserViewModel>> {
    const searchLoginTerm = query.searchLoginTerm
      ? `%${query.searchLoginTerm.toLowerCase()}%`
      : '';
    const searchEmailTerm = query.searchEmailTerm
      ? `%${query.searchEmailTerm.toLowerCase()}%`
      : '';

    const whereConditions = [];
    if (searchLoginTerm)
      whereConditions.push(`LOWER(login) LIKE '${searchLoginTerm}'`);
    if (searchEmailTerm)
      whereConditions.push(`LOWER(email) LIKE '${searchEmailTerm}'`);

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(' OR ')}`
      : '';

    const totalUsersCountQuery = `
    SELECT COUNT(*)
    FROM "User"
    ${whereClause}
  `;

    const totalUsersCountResult =
      await this.dataSource.query(totalUsersCountQuery);

    const totalUsersCount = parseInt(totalUsersCountResult[0].count, 10);

    const offset = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;

    const usersQuery = `
  SELECT * 
  FROM "User"
  ${whereClause}
  ORDER BY "${query.sortBy}" ${query.sortDirection === 'asc' ? 'ASC' : 'DESC'}
  OFFSET ${offset}
  LIMIT ${limit}
`;

    const users = await this.dataSource.query(usersQuery);
    console.log(users);

    const usersToView = {
      pagesCount: Math.ceil(totalUsersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalUsersCount,
      items: await Promise.all(
        users.map((u) => this.TransformUser.transformToViewModel(u)),
      ),
    };
    return usersToView;
  }

  async getByIdUser(id: string) {
    const user = await this.UserModel.findById(id);
    return transformToViewUser(user);
    // const query = `
    // SELECT *
    // FROM "User"
    // WHERE id=$1
    // LIMIT 1
    // `;

    // const result = await this.dataSource.query(query, [id]);
    // console.log(result);
  }
}
