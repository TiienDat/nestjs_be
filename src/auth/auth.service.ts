import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { ChangePasswordDto, VerifyDto } from './dto/create-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService:UsersService,
    private jwtService:JwtService
  ) {}

  async validateUser(username: string, pass: string):Promise<any>{
    const user = await this.usersService.findByEmail(username);
    if(!user) return null

    const isValidPassword = await comparePasswordHelper(pass,user.password)
  if(!isValidPassword) return null

  return user
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user : {
        _id : user._id,
        name: user.name,
        email: user.email
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister (registerDto:CreateUserDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async checkVerify (data:VerifyDto) {
    return await this.usersService.handleCheckVeirfy(data);
  }

  async checkActive (data:string) {
    return await this.usersService.handleCheckActive(data);
  }
  async checkEmail (data:string) {
    return await this.usersService.handleCheckEmail(data);
  }
  async changePassword (changePasswordDto:ChangePasswordDto) {
    return await this.usersService.handleChangePassword(changePasswordDto);
  }

}