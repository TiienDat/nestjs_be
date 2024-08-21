
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { RegisterDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) {}

  
  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req){
    return this.authService.login(req.user);
  }
  @Post('register')
  @Public()
  register(@Body() registerDto:RegisterDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('mail')
  @Public()
  sendMail() {
    this.mailerService
      .sendMail({
        to: 'nguyentiendat120299@gmail.com', 
        subject: 'Testing Nest MailerModule ✔', // Subject line\
        text:"welcome",
        template: 'register', // `.hbs` extension is appended automatically
      context: {
        name: "nameTN",
        activationCode:123456789
      }
      })
    return 'ok'
  }
}