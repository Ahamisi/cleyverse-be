import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Request, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { StoreOnboardingService } from '../services/store-onboarding.service';
import { 
  StartOnboardingDto, 
  UpdateBusinessTypeDto, 
  UpdateSalesChannelsDto, 
  UpdateProductTypesDto, 
  UpdateStoreSetupDto,
  CompleteOnboardingDto,
  OnboardingStatusResponse 
} from '../dto/store-onboarding.dto';

@Controller('stores/onboarding')
@UseGuards(JwtAuthGuard)
export class StoreOnboardingController {
  constructor(
    private readonly onboardingService: StoreOnboardingService,
  ) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  async startOnboarding(@Request() req, @Body() startDto: StartOnboardingDto) {
    const onboarding = await this.onboardingService.startOnboarding(req.user.userId, startDto);
    return {
      message: 'Store onboarding started successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        isCompleted: onboarding.isCompleted,
        createdAt: onboarding.createdAt
      }
    };
  }

  @Get('status')
  async getOnboardingStatus(@Request() req): Promise<OnboardingStatusResponse> {
    return await this.onboardingService.getOnboardingStatus(req.user.userId);
  }

  @Put('business-type')
  async updateBusinessType(@Request() req, @Body() updateDto: UpdateBusinessTypeDto) {
    const onboarding = await this.onboardingService.updateBusinessType(req.user.userId, updateDto);
    return {
      message: 'Business type updated successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        businessType: onboarding.businessType
      }
    };
  }

  @Put('sales-channels')
  async updateSalesChannels(@Request() req, @Body() updateDto: UpdateSalesChannelsDto) {
    const onboarding = await this.onboardingService.updateSalesChannels(req.user.userId, updateDto);
    return {
      message: 'Sales channels updated successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        salesChannels: onboarding.salesChannels
      }
    };
  }

  @Put('product-types')
  async updateProductTypes(@Request() req, @Body() updateDto: UpdateProductTypesDto) {
    const onboarding = await this.onboardingService.updateProductTypes(req.user.userId, updateDto);
    return {
      message: 'Product types updated successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        productTypes: onboarding.productTypes
      }
    };
  }

  @Put('store-setup')
  async updateStoreSetup(@Request() req, @Body() updateDto: UpdateStoreSetupDto) {
    const onboarding = await this.onboardingService.updateStoreSetup(req.user.userId, updateDto);
    return {
      message: 'Store setup updated successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        storeName: onboarding.storeName,
        storeUrl: onboarding.storeUrl,
        storeDescription: onboarding.storeDescription,
        currency: onboarding.currency,
        logoUrl: onboarding.logoUrl,
        bannerUrl: onboarding.bannerUrl
      }
    };
  }

  @Post('complete')
  @HttpCode(HttpStatus.CREATED)
  async completeOnboarding(@Request() req, @Body() completeDto: CompleteOnboardingDto) {
    const result = await this.onboardingService.completeOnboarding(req.user.userId, completeDto, true);
    return {
      message: 'Store onboarding completed successfully! Your store has been created.',
      onboarding: {
        id: result.onboarding.id,
        currentStep: result.onboarding.currentStep,
        isCompleted: result.onboarding.isCompleted
      },
      store: result.store ? {
        id: result.store.id,
        name: result.store.name,
        storeUrl: result.store.storeUrl,
        status: result.store.status,
        createdAt: result.store.createdAt
      } : null
    };
  }

  @Post('complete-without-store')
  @HttpCode(HttpStatus.OK)
  async completeOnboardingWithoutStore(@Request() req, @Body() completeDto: CompleteOnboardingDto) {
    const result = await this.onboardingService.completeOnboarding(req.user.userId, completeDto, false);
    return {
      message: 'Store onboarding completed successfully! You can now create your store when ready.',
      onboarding: {
        id: result.onboarding.id,
        currentStep: result.onboarding.currentStep,
        isCompleted: result.onboarding.isCompleted
      }
    };
  }

  @Put('reset')
  async resetOnboarding(@Request() req) {
    const onboarding = await this.onboardingService.resetOnboarding(req.user.userId);
    return {
      message: 'Store onboarding reset successfully',
      onboarding: {
        id: onboarding.id,
        currentStep: onboarding.currentStep,
        isCompleted: onboarding.isCompleted
      }
    };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOnboarding(@Request() req) {
    await this.onboardingService.deleteOnboarding(req.user.userId);
    return {
      message: 'Store onboarding deleted successfully'
    };
  }

}
