import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid'
import dayjs from 'dayjs';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,

) {}


    isEmailExist = async(email : string)=>{
    const user = await this.userModel.exists({email})
    if(user) return true;
    return false;
  }
  async create(createUserDto: CreateUserDto) {
    const {name, email, password ,phone,address,image} = createUserDto;

    //check email 
    const isExit = await this.isEmailExist(email)
    if(isExit){
      throw new BadGatewayException('email đã tồn tại, vui lòng sử dụng email khác')
    }
    //hash password
    const hashPassword =  await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name, email, password : hashPassword, phone, address, image
    })
    return {
      _id : user._id
    };
  }

  async findAll(query:string,current:number,pageSize:number) {
    const {filter, sort}= aqp(query);

    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize

    if(!current) current=1;
    if(!pageSize) pageSize=10;

    const totalItems =(await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (current - 1 ) * (pageSize)

    const results = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select("-password")
    .sort(sort as any)
    return {results,totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  
  async findByEmail (email:string){
    return await this.userModel.findOne({email})
  }

  async update( updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id : updateUserDto._id},{...updateUserDto});
  }

  remove(_id: string) {
    if(mongoose.isValidObjectId(_id)){
      return this.userModel.deleteOne({_id});
    }else{
      throw new BadRequestException('Id không đúng định dạng')
    }
  }

  async handleRegister (registerDto:CreateUserDto) {
    const {name, email, password} = registerDto
    //check Exit
    const isExit = await this.isEmailExist(email)
    if(isExit === true)
      throw new BadRequestException('Email đã tồn tại, vui lòng sử dụng email khác')

    //check hashPassword
    const hashPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive:false,
      codeId:uuidv4(),
      codeExpired: dayjs().add(1,'minutes')
    })
    //trả ra phản hồi
    return {
      _id : user._id
    }
  }
}
