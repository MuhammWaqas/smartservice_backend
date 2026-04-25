import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // apply globally
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(createBookingDto, req.user);
  }


  @Get()
  findAll(@Req() req: any) {
    console.log("USER FROM TOKEN:", req.user);
    return this.bookingsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  // Ensure user is logged in
  async getUserOrders(@Req() req) {
    const userId = req.user._id; // JWT se user ID mil rahi hai
    return this.bookingsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.remove(id, req.user);
  }
}
