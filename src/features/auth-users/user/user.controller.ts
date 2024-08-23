import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInputModel } from './DTOs/input/UserInputModel.dto';
import { UserService } from './user.service';
import { UserQueryRepository } from './user.query.repository';
import { UserQueryModel } from './DTOs/input/UserQueryModel.dto';
import { userQueryFilter } from 'src/base/utils/queryFilter';
import { TransformUser } from './DTOs/output/TransformUser';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './use-cases/createUser-use.case';
import { DeleteUserCommand } from './use-cases/deleteUser-use.case';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('users')
@UseGuards(AdminAuthGuard)
export class UserController {
  constructor(
    protected userService: UserService,
    protected userQueryRepository: UserQueryRepository,
    private readonly TransformUser: TransformUser,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getUsers(@Query() query: UserQueryModel) {
    return await this.userQueryRepository.getUsers(userQueryFilter(query));
  }

  @Post()
  async createUser(@Body() dto: UserInputModel) {
    const result = await this.commandBus.execute(new CreateUserCommand(dto));
    return this.TransformUser.transformToViewModel(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(id));
    if (!result) {
      throw new NotFoundException();
    }
  }
}
