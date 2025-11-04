import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  // 👇 change from single image to an array of images
  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  stock: number;

  @Prop({ default: false })
  featured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
