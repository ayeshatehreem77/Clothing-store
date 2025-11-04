import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findAll(role?: 'admin' | 'user') {
        if (role) {
            const users = await this.userModel.find({ role }).exec();
            if (!users.length) throw new NotFoundException('Role not found');
            return users;
        }
        return this.userModel.find().exec();
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User Not Found');
        return user;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto);
        const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        return await newUser.save();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
        }).exec();

        if (!updatedUser) throw new NotFoundException('User Not Found');
        return updatedUser;
    }

    async delete(id: string) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) throw new NotFoundException('User Not Found');
        return deletedUser;
    }
}
