import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'perfumes' }) 
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true }) // optional: email should be unique
  brand: string;

  @Prop({required: true})
  price: number;

  @Prop({required: true})
  description: string;

  @Prop({required: true})
  image: string;

  @Prop({required: true})
  stock: number
}

export const ProductSchema = SchemaFactory.createForClass(Product);
