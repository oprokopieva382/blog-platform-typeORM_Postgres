import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;
@Schema()
export class Session {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  iat: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  exp: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
