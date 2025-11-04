import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post()
  addToWishlist(@Req() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(req.user.userId, addToWishlistDto);
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }

  @Delete()
  clearWishlist(@Req() req) {
    return this.wishlistService.clearWishlist(req.user.userId);
  }
}
