import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schemas';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) { }

  async create(userId: string, dto: CreateReviewDto) {
    // ✅ Check if user already reviewed this product
    const existing = await this.reviewModel.findOne({ userId, productId: dto.productId });
    if (existing) throw new BadRequestException('You already reviewed this product');

    const review = new this.reviewModel({
      userId,
      productId: new Types.ObjectId(dto.productId),
      rating: dto.rating,
      comment: dto.comment,
    });

    return review.save();
  }

  async findByProduct(productId: string) {
    const reviews = await this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .populate('userId', 'name email');
    return reviews; 
  }

  async delete(userId: string, reviewId: string) {
    const review = await this.reviewModel.findOneAndDelete({ _id: reviewId, userId });
    if (!review) throw new NotFoundException('Review not found or not yours');
    return { message: 'Review deleted' };
  }
}
