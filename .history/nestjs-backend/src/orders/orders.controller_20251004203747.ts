import { 
  Controller, Get, Post, Patch, Delete, Param, Body, ValidationPipe, 
  UseGuards, Request, ForbiddenException 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ Only logged-in users can create orders
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(ValidationPipe) createOrderDto: CreateOrderDto, @Request() req) {
    // attach logged-in user's id instead of allowing manual userId
    createOrderDto.userId = req.user.sub;
    return this.ordersService.create(createOrderDto);
  }

  // ✅ Admins see all orders, users see their own
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (req.user.role === 'admin') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByUser(req.user.sub);
  }

  // ✅ User can see only their own order
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.findOne(id);
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  // ✅ Only admin can update
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateOrderDto: UpdateOrderDto, @Request() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can update orders');
    return this.ordersService.update(id, updateOrderDto);
  }

  // ✅ Only admin can delete
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Only admin can delete orders');
    return this.ordersService.delete(id);
  }
}
