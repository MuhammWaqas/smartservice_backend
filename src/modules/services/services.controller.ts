import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ForbiddenException,
} from '@nestjs/common';

// import { slugify } from 'slugify';

import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesEnum } from '../../common/enums/roles.enum';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    console.log("USER:", req.user);
    // return this.servicesService.findAll(req.user);
    return this.servicesService.findAll(req.user || null);
  }

  // Public
  @Get('public')
  findAllPublic() {
    return this.servicesService.findAll(null);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateServiceStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @Req() req
  ) {
    return this.servicesService.updateStatus(id, dto, req.user);
  }

  //single service fetch through slug
  // static route first
  @Get('categories')
  async getCategories() {
    return this.servicesService.getCategories();
  }

  // Get all services in a category
  @Get('category/:categorySlug')
  getServicesByCategory(@Param('categorySlug') categorySlug: string) {
    return this.servicesService.findByCategory(categorySlug);
  }

  // dynamic route second
  @Get(':categorySlug/:slug')
  findByCategoryAndSlug(
    @Param('categorySlug') categorySlug: string,
    @Param('slug') slug: string,
  ) {
    return this.servicesService.findBySlugAndCategory(slug, categorySlug);
  }



  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // No auth required for public page
  // @Get('slug/:slug')
  // findBySlug(@Param('slug') slug: string) {
  //   return this.servicesService.findBySlug(slug);
  // }


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN, RolesEnum.PROVIDER)
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './uploads/services',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
  )

  create(@UploadedFile() file: Express.Multer.File, @Req() req) {
    console.log(req.user); // <- check here

    if (req.user.role === RolesEnum.PROVIDER && !req.user.isProviderActive) {
      throw new ForbiddenException('Provider not activated by admin');
    }

    const dto: CreateServiceDto = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: Number(req.body.price),
      images: file ? [file.filename] : [],
      provider: req.user._id,  // <- important
      status: 'pending',       // default status
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
    };

    return this.servicesService.create(dto, req.user);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN, RolesEnum.PROVIDER)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './uploads/services',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
  )

  update(@Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req) {

    if (file) dto.images = [file.filename];
    return this.servicesService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
