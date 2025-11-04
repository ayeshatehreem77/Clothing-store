import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from 'src/schemas/cart.schemas';
import { AddToCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) { }

  // Get user's cart
  async getCart(userId: string) {
    if (!userId) throw new BadRequestException('User ID required');

    const cart = await this.cartModel
      .findOne({ userId })
      .populate({
        path: 'items.productId',
        select: 'name price image description',
      })
      .exec();

    if (!cart) return { items: [] };

    const formattedItems = cart.items.map((item: any) => ({
      _id: item._id,
      quantity: item.quantity,
      product: item.productId
        ? {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image || null, // ✅ fixed
        }
        : null,
    }));

    return { _id: cart._id, items: formattedItems };
  }

  // Add product to cart
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;
    console.log('📦 Received addToCart request:', { userId, productId, quantity });

    if (!userId || !productId || quantity <= 0)
      throw new BadRequestException('Invalid cart data');

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);

    // ✅ Find existing cart
    let cart = await this.cartModel.findOne({ userId: userObjectId });
    console.log('🧺 Existing cart found:', cart ? 'Yes' : 'No');

    if (!cart) {
      // ✅ Create a new cart
      cart = new this.cartModel({
        userId: userObjectId,
        items: [{ productId: productObjectId, quantity }],
      });
      console.log('🆕 Creating new cart...');
    } else {
      // ✅ Check if product already exists in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productObjectId.toString(),
      );
      console.log('🔍 Existing item in cart:', existingItem ? 'Yes' : 'No');

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        console.log('➕ Increased quantity to:', existingItem.quantity);
      } else {
        // Add new item
        cart.items.push({ productId: productObjectId, quantity });
        console.log('🛍️ Added new product to cart');
      }
    }

    await cart.save();
    console.log('✅ Cart saved successfully:', cart);

    const updatedCart = await this.getCart(userId);
    console.log('🔁 Returning updated cart:', updatedCart);
    return updatedCart;
  }


  // Remove one product
  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString(),
    );

    await cart.save();
    return this.getCart(userId);
  }

  // Clear all items
  async clearCart(userId: string) {
    await this.cartModel.findOneAndUpdate({ userId }, { items: [] });
    return { items: [] };
  }
}
