import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);


export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
