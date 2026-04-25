import { Controller, Get, Patch, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {

 constructor(private providersService: ProvidersService){}

 @Get()
 getProviders(){
   return this.providersService.getProviders();
 }

 @Patch('activate/:id')
 activateProvider(@Param('id') id:string){
   return this.providersService.activateProvider(id);
 }

 @Patch('deactivate/:id')
 deactivateProvider(@Param('id') id:string){
   return this.providersService.deactivateProvider(id);
 }

}
