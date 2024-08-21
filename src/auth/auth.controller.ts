
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
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
    return 'ok'
  }
}