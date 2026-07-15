import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RideTypeDocument = HydratedDocument<RideType>;

@Schema({ timestamps: true })
export class RideType {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  seats: number;

  @Prop({ type: String, required: true, trim: true })
  estimatedTime: string;

  @Prop({ type: String, default: null })
  image?: string;
}

export const RideTypeSchema = SchemaFactory.createForClass(RideType);
