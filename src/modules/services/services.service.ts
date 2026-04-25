import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../users/schemas/users.schema';

// import { RolesEnum } from '../../common/enums/roles.enum';
import slugify from 'slugify';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(User.name) private userModel: Model<any>, // FIX
  ) { }


  async create(dto: CreateServiceDto, user: any): Promise<Service> {

    console.log("JWT USER:", user);

    const dbUser = await this.userModel.findById(user._id);
    console.log("DB USER:", dbUser);

    if (user.role === 'provider' && !dbUser.isProviderActive) {
      throw new ForbiddenException('Provider not activated by admin');
    }

    dto.slug = slugify(dto.name, { lower: true, strict: true });
    dto['category'] = slugify(dto.category, { lower: true, strict: true });

    dto['provider'] = user._id;

    const service = new this.serviceModel(dto);
    return service.save();
  }

  // add a TS signature explicitly
  async updateStatus(id: string, dto: UpdateServiceDto, user: any): Promise<Service> {
    const service = await this.serviceModel.findById(id);
    if (!service) throw new NotFoundException('Service not found');

    // Optional: prevent providers from changing status
    if (user.role === 'provider') {
      throw new ForbiddenException('Providers cannot update status');
    }

    // Update only the status from DTO
    if (dto.status) service.status = dto.status;

    return service.save();
  }


  // async findAll(user: any): Promise<Service[]> {
  //   if (user.role === 'admin') {
  //     return this.serviceModel.find().populate('provider', 'username email');
  //   } else {
  //     return this.serviceModel.find({ provider: user._id });
  //   }
  // }

  async findAll(user: any): Promise<Service[]> {
    
    if (!user) {
      return this.serviceModel
        .find({ status: 'approved' })
        .populate('provider', 'username email');
    }

    if (user.role === 'admin') {
      return this.serviceModel.find().populate('provider', 'username email');
    } else if (user.role === 'provider') {
      return this.serviceModel.find({ provider: user._id });
    } else {
      
      return this.serviceModel.find({ status: 'approved' }).populate('provider', 'username email');
    }
  }




  async findOne(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).populate('provider', 'username email');
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, dto: UpdateServiceDto, user: any): Promise<Service> {
    const service = await this.serviceModel.findById(id);
    if (!service) throw new NotFoundException('Service not found');


    console.log("JWT USER ID:", user._id);
    console.log("SERVICE PROVIDER ID:", service.provider.toString());

    // Provider can update only own service
    if (user.role === 'provider' && !service.provider.equals(user._id)) {
      throw new ForbiddenException('You cannot update others service');
    }

    // Provider cannot update status directly
    if (user.role === 'provider') delete dto.status;

    const updated = await this.serviceModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Service not found'); // check for null

    return updated;
  }


  async remove(id: string): Promise<Service> {
    const service = await this.serviceModel.findByIdAndDelete(id);
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  // async findBySlug(slug: string): Promise<Service> {
  //   const service = await this.serviceModel
  //     .findOne({ slug })
  //     .populate('provider', 'username email');
  //   if (!service) throw new NotFoundException('Service not found');
  //   return service;
  // }


  // for using slug best for seo
  async findBySlugAndCategory(slug: string, categorySlug: string): Promise<Service> {
    const service = await this.serviceModel
      .findOne({ slug, category: categorySlug, status: 'approved' })
      .sort({ createdAt: -1 }) // newest first
      .limit(20) // max 20 services
      .populate('provider', 'username email');

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async findByCategory(categorySlug: string) {
    return this.serviceModel.find({
      category: categorySlug,
      status: 'approved', // IMPORTANT
    });
  }


  //navbar kay leya dynamic slug plus categories
  async getCategories(): Promise<any[]> {
    const categories = await this.serviceModel.distinct('category');
    return categories.map(cat => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1), // display label
      href: `/services/${cat}` // URL
    }));
  }


}
