// src/modules/bookings/bookings.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) { }

  // async create(createBookingDto: CreateBookingDto, user: any): Promise<Booking> {
  //   const booking = new this.bookingModel(createBookingDto);
  //   return booking.save();
  // }

  // src/modules/bookings/bookings.service.ts

  async create(dto: CreateBookingDto, user: any) {
    const service = await this.serviceModel.findById(dto.service_id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const booking = new this.bookingModel({
      slug: dto.slug,
      date: dto.date, // Mongoose will handle the string-to-date conversion
      time: dto.time,
      total_amount: dto.total_amount,

      // FIX: Map the flat DTO fields into the nested 'address' object
      address: {
        street: dto.address,  // or dto.street depending on what you send
        city: dto.city,
        zip: dto.zip,
        lat: dto.location?.lat,
        lng: dto.location?.lng,
      },

      user_id: new Types.ObjectId(user._id),
      service_id: new Types.ObjectId(dto.service_id),
      provider_id: new Types.ObjectId(service.provider),

      status: 'pending',
    });

    return booking.save();
  }

  async findAll(user: any): Promise<Booking[]> {
    // Role-based fetch
    if (user.role === 'admin') return this.bookingModel.find().populate('user_id service_id provider_id').exec();
    if (user.role === 'provider') return this.bookingModel.find({ provider_id: user._id }).populate('user_id service_id').exec();

    // USER → only own bookings
    return this.bookingModel.find({ user_id: user._id })
      .populate('service_id provider_id')
      .exec();
  }

  // bookings.service.ts

  async findAllByUser(userId: string): Promise<Booking[]> {
    // Sirf wahi bookings laye jo is user ne ki hain
    return this.bookingModel
      .find({ user_id: userId })
      .populate('service_id')
      .populate('provider_id', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, user: any): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).populate('user_id service_id provider_id').exec();
    if (!booking) throw new NotFoundException('Booking not found');
    // User can access only own booking
    if (user.role === 'user' && booking.user_id.toString() !== user._id) throw new ForbiddenException();
    if (user.role === 'provider' && booking.provider_id._id.toString() !== user._id) throw new ForbiddenException();
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: any) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) throw new NotFoundException('Booking not found');

    // user cannot update
    if (user.role === 'user') {
      throw new ForbiddenException();
    }

    // provider can only update own bookings
    if (
      user.role === 'provider' &&
      booking.provider_id.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException();
    }

    // allowed transitions rule
    const allowedTransitions = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in-progress', 'cancelled'],
      'in-progress': ['completed'],
    };

    const current = booking.status;
    const next = updateBookingDto.status;

    if (next && !allowedTransitions[current]?.includes(next)) {
      throw new ForbiddenException(`Invalid status transition`);
    }

    if (next) booking.status = next;

    return booking.save();
  }

  async remove(id: string, user: any): Promise<any> {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only admin or owner can delete
    if (user.role === 'user' && booking.user_id.toString() !== user._id) {
      throw new ForbiddenException();
    }

    await booking.deleteOne();

    return {
      message: 'Booking deleted successfully',
    };
  }

}
