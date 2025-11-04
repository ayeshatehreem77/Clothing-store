import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './products.schemas'; // ✅ adjust path

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    default: [],
  })
  items: {
    productId: Types.ObjectId | Product; // ✅ either ObjectId before populate OR Product after populate
    quantity: number;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// ✅ Auto populate
CartSchema.pre(/^find/, function (this: any, next) {
  this.populate({
    path: 'items.productId',
    select: 'name price image description',
  });
  next();
});
