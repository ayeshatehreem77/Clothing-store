import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from 'src/schemas/wishtlist.schemas';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async getWishlist(userId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId }).populate('products');
    if (!wishlist) return { products: [] };
    return wishlist;
  }

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;
    let wishlist = await this.wishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId, products: [new Types.ObjectId(productId)] });
    } else {
      if (!wishlist.products.includes(new Types.ObjectId(productId))) {
        wishlist.products.push(new Types.ObjectId(productId));
      }
    }

    return await wishlist.save();
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId });
    if (!wishlist) throw new NotFoundException('Wishlist not found');

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    return await wishlist.save();
  }

  async clearWishlist(userId: string) {
    return await this.wishlistModel.findOneAndUpdate(
      { userId },
      { products: [] },
      { new: true },
    );
  }
}
