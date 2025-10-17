import { Controller, Get } from '@nestjs/common';
import { StoreOnboardingService } from '../services/store-onboarding.service';

@Controller('stores/onboarding/options')
export class PublicStoreOnboardingController {
  constructor(
    private readonly onboardingService: StoreOnboardingService,
  ) {}

  @Get('business-types')
  getBusinessTypes() {
    return {
      message: 'Business types retrieved successfully',
      businessTypes: this.onboardingService.getBusinessTypes()
    };
  }

  @Get('sales-channels')
  getSalesChannels() {
    return {
      message: 'Sales channels retrieved successfully',
      salesChannels: this.onboardingService.getSalesChannels()
    };
  }

  @Get('product-types')
  getProductTypes() {
    return {
      message: 'Product types retrieved successfully',
      productTypes: this.onboardingService.getProductTypes()
    };
  }
}
