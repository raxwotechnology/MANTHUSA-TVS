import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  async findAll() {
    return this.userModel.find().select('-passwordHash').populate('role').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').populate('role').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: any) {
    const { password, ...userData } = createUserDto;
    if (!password || password.length < 10) throw new BadRequestException('Password must contain at least 10 characters.');
    userData.passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await new this.userModel(userData).save();
    return this.findOne(createdUser._id.toString());
  }

  async update(id: string, updateUserDto: any) {
    const { password, ...userData } = updateUserDto;
    if (password) {
      if (password.length < 10) throw new BadRequestException('Password must contain at least 10 characters.');
      userData.passwordHash = await bcrypt.hash(password, 12);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).select('-passwordHash').populate('role').exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
