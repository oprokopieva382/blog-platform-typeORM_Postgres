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

  async getByLogin(login: string) {
    const query = `
    SELECT u.login, u.id 
    FROM "User" u
    WHERE u.login = $1
    `;

    const result = await this.dataSource.query(query, [login]);
    return result[0];
  }

  async getByEmail(email: string) {
    const query = `
    SELECT u.email, u.id 
    FROM "User" u
    WHERE u.email = $1
    `;

    const result = await this.dataSource.query(query, [email]);
    return result[0];
  }

  async getByConfirmationCode(code: string) {
    // return await this.UserModel.findOne({
    //   'emailConfirmation.confirmationCode': code,
    // });
    const query = `
    SELECT u.confirmationCode, u.id, u.isConfirmed
    FROM "User" u
    WHERE u.confirmationCode = $1
    `;

    const result = await this.dataSource.query(query, [code]);
    return result[0];
  }

  async getByRecoveryCode(recoveryCode: string) {
    return await this.PasswordRecoveryCodeModel.findOne({ recoveryCode });
  }

  async updateConfirmation(id: string) {
    // return await this.UserModel.findByIdAndUpdate(
    //   { _id },
    //   { $set: { 'emailConfirmation.isConfirmed': true } },
    //   { new: true },
    // );
    const query = `
UPDATE "User" u
SET "isConfirmed" = true
WHERE u.id = $1
RETURNING *
`;

    const result = this.dataSource.query(query, [id]);
    return result[0];
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
    const createTableQuery = `
  CREATE TABLE IF NOT EXISTS public."User" (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    login VARCHAR(10) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "confirmationCode" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expirationDate" TIMESTAMP NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false
  );
  `;

    await this.dataSource.query(createTableQuery);

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
    return result[0];
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
