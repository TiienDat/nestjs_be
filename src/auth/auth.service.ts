import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';


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

}