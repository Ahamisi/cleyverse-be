import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { 
  CheckUserDto, 
  LoginDto, 
  SendTempCodeDto, 
  VerifyTempCodeDto, 
  ResendTempCodeDto 
} from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    return await this.authService.checkUser(
      checkUserDto.email, 
      checkUserDto.deviceFingerprint
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(
      loginDto.email, 
      loginDto.password,
      loginDto.deviceFingerprint
    );
  }

  @Post('send-temp-code')
  async sendTempCode(@Body() sendTempCodeDto: SendTempCodeDto) {
    return await this.authService.sendTempCode(
      sendTempCodeDto.email,
      sendTempCodeDto.reason
    );
  }

  @Post('verify-temp-code')
  async verifyTempCode(@Body() verifyTempCodeDto: VerifyTempCodeDto) {
    return await this.authService.verifyTempCode(
      verifyTempCodeDto.email,
      verifyTempCodeDto.code,
      verifyTempCodeDto.deviceFingerprint
    );
  }

  @Post('resend-temp-code')
  async resendTempCode(@Body() resendTempCodeDto: ResendTempCodeDto) {
    return await this.authService.resendTempCode(resendTempCodeDto.email);
  }
}
