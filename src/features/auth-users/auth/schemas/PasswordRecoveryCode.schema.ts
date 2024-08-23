import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordRecoveryCodeDocument =
  HydratedDocument<PasswordRecoveryCode>;
@Schema()
export class PasswordRecoveryCode {
  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  createdAt: string;
}

export const PasswordRecoveryCodeSchema =
  SchemaFactory.createForClass(PasswordRecoveryCode);
