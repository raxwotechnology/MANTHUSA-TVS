import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  async findAll() {
    return this.userModel.find().select('-passwordHash').populate('role').populate('branch').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').populate('role').populate('branch').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: any) {
    const { password, ...userData } = createUserDto;
    if (!password || password.length < 6) throw new BadRequestException('Password must contain at least 6 characters.');
    if (!userData.branch) delete userData.branch;
    userData.passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await new this.userModel(userData).save();
    return this.findOne(createdUser._id.toString());
  }

  async update(id: string, updateUserDto: any) {
    const { password, ...userData } = updateUserDto;
    if (password && password.trim()) {
      if (password.length < 6) throw new BadRequestException('Password must contain at least 6 characters.');
      userData.passwordHash = await bcrypt.hash(password, 12);
    }
    if (!userData.branch) {
      userData.branch = null;
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).select('-passwordHash').populate('role').populate('branch').exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateAvatar(id: string, avatar: string) {
    if (!/^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar || '')) {
      throw new BadRequestException('Please upload a valid image.');
    }
    if (avatar.length > 7 * 1024 * 1024) {
      throw new BadRequestException('Profile image must be smaller than 5 MB.');
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { avatar }, { new: true })
      .select('-passwordHash')
      .populate('role')
      .populate('branch')
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
