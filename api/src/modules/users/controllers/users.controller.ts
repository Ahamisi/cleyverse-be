import { Controller, Post, Body, Get, Query, Put, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserService, EmailVerificationService } from '../services';
import { 
  CreateUserDto, 
  UpdatePersonalInfoDto, 
  UpdateGoalDto, 
  CheckUsernameDto, 
  UpdateUsernameDto, 
  UpdateProfileDto,
  CompleteOnboardingDto,
  SetupPasswordDto,
  VerifyEmailAndSetupPasswordDto,
  UpdatePasswordDto
} from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return this.userService.register(userData);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.emailVerificationService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.emailVerificationService.resendVerification(body.email);
  }

  @Post('check-username')
  async checkUsername(@Body() checkUsernameDto: CheckUsernameDto) {
    return this.userService.checkUsernameAvailability(checkUsernameDto.username);
  }

  @Get('categories')
  async getCategories() {
    return { categories: this.userService.getCategories() };
  }

  @Get('goals')
  async getGoals() {
    return { goals: this.userService.getGoals() };
  }

  @Get('public/:username')
  async getPublicProfile(@Param('username') username: string) {
    return this.userService.getPublicProfile(username);
  }

  // ==================== AUTHENTICATED ENDPOINTS ====================

  @UseGuards(JwtAuthGuard)
  @Put('personal-info')
  async updatePersonalInfo(@Request() req, @Body() personalInfo: UpdatePersonalInfoDto) {
    const user = await this.userService.updatePersonalInfo(req.user.userId, personalInfo);
    return {
      message: 'Personal information updated successfully',
      user,
      nextStep: 'username'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('username')
  async updateUsername(@Request() req, @Body() updateUsernameDto: UpdateUsernameDto) {
    const user = await this.userService.updateUsername(req.user.userId, updateUsernameDto?.username);
    return {
      message: 'Username updated successfully',
      user,
      nextStep: 'goal'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('goal')
  async updateGoal(@Request() req, @Body() updateGoalDto: UpdateGoalDto) {
    const user = await this.userService.updateGoal(req.user.userId, updateGoalDto?.goal);
    return {
      message: 'Goal updated successfully',
      user,
      nextStep: 'platforms'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() profileData: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, profileData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-onboarding')
  async completeOnboarding(@Request() req, @Body() finalData: CompleteOnboardingDto) {
    return this.userService.completeOnboarding(req.user.userId, finalData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding-status')
  async getOnboardingStatus(@Request() req) {
    return this.userService.getOnboardingStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getOnboardingStatus(req.user.userId);
  }

  @Post('setup-password')
  @UseGuards(JwtAuthGuard)
  async setupPassword(@Request() req, @Body() setupPasswordDto: SetupPasswordDto) {
    const user = await this.userService.setupPassword(req.user.userId, setupPasswordDto.password);
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Password set up successfully',
      user: userWithoutPassword
    };
  }

  @Post('verify-and-setup-password')
  async verifyEmailAndSetupPassword(@Body() verifyAndSetupDto: VerifyEmailAndSetupPasswordDto) {
    const user = await this.userService.verifyEmailAndSetupPassword(
      verifyAndSetupDto.token, 
      verifyAndSetupDto.password
    );
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Email verified and password set up successfully',
      user: userWithoutPassword
    };
  }

  @Put('update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.updatePassword(
      req.user.userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword
    );
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'Password updated successfully',
      user: userWithoutPassword
    };
  }
}
