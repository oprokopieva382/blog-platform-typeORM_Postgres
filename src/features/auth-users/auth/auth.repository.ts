import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PasswordRecoveryCode,
  PasswordRecoveryCodeDocument,
} from './schemas/PasswordRecoveryCode.schema';
import { User, UserDocument } from '../user/schemas/User.schema';
import { Session, SessionDocument } from './schemas/Session.schema';
import { UserDBType } from 'src/base/types/UserDBType';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    @InjectModel(Session.name)
    private readonly SessionModel: Model<SessionDocument>,
    @InjectModel(PasswordRecoveryCode.name)
    private readonly PasswordRecoveryCodeModel: Model<PasswordRecoveryCodeDocument>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getByLoginOrEmail(login: string, email: string) {
    return await this.UserModel.findOne({
      $or: [{ email }, { login }],
    });
  }

  async getByLogin(login: string) {
    return await this.UserModel.findOne({ login });
  }

  async getByEmail(email: string) {
    return await this.UserModel.findOne({ email });
  }

  async getByConfirmationCode(code: string) {
    return await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async getByRecoveryCode(recoveryCode: string) {
    return await this.PasswordRecoveryCodeModel.findOne({ recoveryCode });
  }

  async updateConfirmation(_id: Types.ObjectId) {
    return await this.UserModel.findByIdAndUpdate(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
      { new: true },
    );
  }

  async updateCode(_id: Types.ObjectId, newCode: string) {
    await this.UserModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          'emailConfirmation.confirmationCode': newCode,
        },
      },
    );
  }

  async registerUser(dto: UserDBType) {
  const query = `
  INSERT INTO "User" ("login", "email", "password", "createdAt", "confirmationCode", "expirationDate", "isConfirmed")
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
  `;

    const values = [
      dto.login,
      dto.email,
      dto.password,
      dto.createdAt,
      dto.confirmationCode,
      dto.expirationDate,
      dto.isConfirmed,
    ];

    const result = await this.dataSource.query(query, values);
    return result[0]
  }

  async savePasswordRecoveryInfo(passwordRecovery: PasswordRecoveryCode) {
    return await this.PasswordRecoveryCodeModel.create({
      ...passwordRecovery,
    });
  }

  async setNewPassword(email: string, newPassword: string) {
    return await this.UserModel.findOneAndUpdate(
      { email },
      { $set: { password: newPassword } },
      { new: true },
    );
  }

  async getSessionByDeviceId(deviceId: string) {
    return await this.SessionModel.findOne({ deviceId });
  }

  async createSession(newSession: any) {
    return await this.SessionModel.create(newSession);
  }

  async deleteSession(deviceId: string) {
    return await this.SessionModel.findOneAndDelete({
      deviceId,
    });
  }

  async updateSession({
    iat,
    exp,
    deviceId,
  }: {
    iat: string;
    exp: string;
    deviceId: string;
  }) {
    return await this.SessionModel.findOneAndUpdate(
      { deviceId },
      { $set: { iat, exp } },
      { new: true },
    );
  }
}
