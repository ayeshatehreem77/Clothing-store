import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    console.log('Decoded user:', req.user);
    return this.cartService.getCart(req.user.sub);
  }

  @Post()
addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
  const userId = req.user?.sub;
  if (!userId) throw new BadRequestException('User not found in token');
  return this.cartService.addToCart(userId, addToCartDto);
}


  @Delete(':productId')
  removeFromCart(@Req() req, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.sub, productId);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.sub);
  }
}
