import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/orders.schemas';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().populate('userId').populate('products.productId').exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel.findById(id).populate('userId').populate('products.productId').exec();
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async findByUser(userId: string): Promise<Order[]> {
        return this.orderModel.find({ userId }).populate('products.productId').exec();
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
        if (!updatedOrder) throw new NotFoundException('Order not found');
        return updatedOrder;
    }

    async delete(id: string): Promise<Order> {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        if (!deletedOrder) throw new NotFoundException('Order not found');
        return deletedOrder;
    }
}
