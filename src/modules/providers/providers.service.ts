import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProvidersService {

 constructor(
  @InjectModel('User') private userModel: Model<any>
 ){}

 async getProviders(){
   return this.userModel.find({ role:'provider' });
 }

 async activateProvider(id:string){

  const provider = await this.userModel.findById(id);

  if(!provider){
    throw new NotFoundException("Provider not found");
  }

  provider.isProviderActive = true;

  return provider.save();
 }

 async deactivateProvider(id:string){

  const provider = await this.userModel.findById(id);

  if(!provider){
    throw new NotFoundException("Provider not found");
  }

  provider.isProviderActive = false;

  return provider.save();
 }

}
