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
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto, VerifyDto } from '@/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private readonly mailerService: MailerService
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
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results};
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
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive:false,
      codeId:codeId,
      codeExpired: dayjs().add(5,'days')
    })

    this.mailerService.sendMail({
        to: 'nguyentiendat120299@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', // Subject line\
        text:"welcome",
        template: 'register', // `.hbs` extension is appended automatically
        context: {
            name: user?.name ?? user.email,
            activationCode: codeId
        }
    })
    //trả ra phản hồi
    return {
      _id : user._id
    }
  }
  async handleCheckVeirfy (data: VerifyDto){
    const user = await this.userModel.findOne({
      _id : data._id,
      codeId : data.code
    })
    if(!user){
       throw new BadRequestException("Mã code không hợp lệ")
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)
    if(isBeforeCheck){
      await this.userModel.updateOne({_id : data._id},{
        isActive : true
      })
      return {isBeforeCheck};
    }else{
      throw new BadRequestException("Mã code đã hết hạn")
    }
  }

  async handleCheckActive (email:string){
    const user = await this.userModel.findOne({email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if(user.isActive){
      throw new BadRequestException("Tài đã được kích hoạt")
    }else{
      const codeId = uuidv4();
      await user.updateOne({
        codeId:codeId,
        codeExpired: dayjs().add(5,'days')
      })

      this.mailerService.sendMail({
        to: 'nguyentiendat120299@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', // Subject line\
        text:"welcome retry Active Email",
        template: 'register', // `.hbs` extension is appended automatically
        context: {
            name: user?.name ?? user.email,
            activationCode: codeId
        }
    })
    }
    return {_id : user._id}
  }

  async handleCheckEmail (email : string){
    const user = await this.userModel.findOne({email})
    if(user){
      const codeId = uuidv4();
      await user.updateOne({
        codeId:codeId,
        codeExpired: dayjs().add(5,'days')
      })

      this.mailerService.sendMail({
        to: 'nguyentiendat120299@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', // Subject line\
        text:"welcome retry Active Email",
        template: 'register', // `.hbs` extension is appended automatically
        context: {
            name: user?.name ?? user.email,
            activationCode: codeId
        }
    })
    return true
    }else{
      throw new BadRequestException("Email không hợp lệ")
    }
  }


  async handleChangePassword (changePasswordDto :  ChangePasswordDto){
    const user = await this.userModel.findOne({
      codeId : changePasswordDto.code
    })
    if(changePasswordDto.confirmPassword !== changePasswordDto.password){
      throw new BadRequestException("Mật khẩu/ xác nhận mật khẩu không chính xác !")
   }
    if(!user){
       throw new BadRequestException("Email không tồn tại")
    }
    else if(user){

    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)
    if(isBeforeCheck){
      const newPasword = await hashPasswordHelper(changePasswordDto.password)
      await user.updateOne({password : newPasword})
      return {isBeforeCheck};
    }else{
      throw new BadRequestException("Mã code đã hết hạn")
    }
  }
}

