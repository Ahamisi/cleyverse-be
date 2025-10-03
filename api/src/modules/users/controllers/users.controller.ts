import { Controller, Post, Body, Get, Query, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserService, EmailVerificationService } from '../services';
import { 
  CreateUserDto, 
  UpdatePersonalInfoDto, 
  UpdateGoalDto, 
  CheckUsernameDto, 
  UpdateUsernameDto, 
  UpdateProfileDto,
  CompleteOnboardingDto 
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
}
