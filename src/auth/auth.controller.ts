
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage} from '@/decorator/customize';
import { ChangePasswordDto, RegisterDto, VerifyDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) {}

  
  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch login")
  handleLogin(@Request() req){
    return this.authService.login(req.user);
  }
  @Post('register')
  @Public()
  register(@Body() registerDto:RegisterDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('verify-user')
  @Public()
  verify(@Body() verifyDto:VerifyDto) {
    return this.authService.checkVerify(verifyDto);
  }

  @Post('retry-active')
  @Public()
  retryEmail(@Body("email") email:string) {
    return this.authService.checkActive(email);
  }
  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email:string) {
    return this.authService.checkEmail(email);
  }
  @Post('change-password')
  @Public()
  changePassword(@Body() changePasswordDto:ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
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