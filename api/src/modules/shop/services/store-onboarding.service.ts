import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreOnboarding, OnboardingStep, BusinessType, SalesChannel, ProductType } from '../entities/store-onboarding.entity';
import { Store, StoreStatus, StoreCurrency } from '../entities/store.entity';
import { 
  StartOnboardingDto, 
  UpdateBusinessTypeDto, 
  UpdateSalesChannelsDto, 
  UpdateProductTypesDto, 
  UpdateStoreSetupDto,
  CompleteOnboardingDto,
  OnboardingStatusResponse 
} from '../dto/store-onboarding.dto';

@Injectable()
export class StoreOnboardingService {
  constructor(
    @InjectRepository(StoreOnboarding)
    private readonly onboardingRepository: Repository<StoreOnboarding>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async startOnboarding(userId: string, startDto: StartOnboardingDto): Promise<StoreOnboarding> {
    // Check if user already has an onboarding session
    const existingOnboarding = await this.onboardingRepository.findOne({
      where: { userId }
    });

    if (existingOnboarding) {
      return existingOnboarding;
    }

    // Create new onboarding session
    const onboarding = this.onboardingRepository.create({
      userId,
      currentStep: OnboardingStep.WELCOME
    });

    return await this.onboardingRepository.save(onboarding);
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStatusResponse> {
    const onboarding = await this.onboardingRepository.findOne({
      where: { userId }
    });

    if (!onboarding) {
      throw new NotFoundException('No onboarding session found. Please start onboarding first.');
    }

    const nextSteps = this.getNextSteps(onboarding);

    return {
      id: onboarding.id,
      currentStep: onboarding.currentStep,
      businessType: onboarding.businessType,
      salesChannels: onboarding.salesChannels,
      productTypes: onboarding.productTypes,
      storeName: onboarding.storeName,
      storeUrl: onboarding.storeUrl,
      storeDescription: onboarding.storeDescription,
      currency: onboarding.currency,
      logoUrl: onboarding.logoUrl,
      bannerUrl: onboarding.bannerUrl,
      isCompleted: onboarding.isCompleted,
      nextSteps,
      createdAt: onboarding.createdAt,
      updatedAt: onboarding.updatedAt
    };
  }

  async updateBusinessType(userId: string, updateDto: UpdateBusinessTypeDto): Promise<StoreOnboarding> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    onboarding.businessType = updateDto.businessType;
    onboarding.currentStep = OnboardingStep.SALES_CHANNELS;
    
    return await this.onboardingRepository.save(onboarding);
  }

  async updateSalesChannels(userId: string, updateDto: UpdateSalesChannelsDto): Promise<StoreOnboarding> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    if (updateDto.salesChannels.length === 0) {
      throw new BadRequestException('At least one sales channel must be selected');
    }
    
    onboarding.salesChannels = updateDto.salesChannels;
    onboarding.currentStep = OnboardingStep.PRODUCT_TYPE;
    
    return await this.onboardingRepository.save(onboarding);
  }

  async updateProductTypes(userId: string, updateDto: UpdateProductTypesDto): Promise<StoreOnboarding> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    if (updateDto.productTypes.length === 0) {
      throw new BadRequestException('At least one product type must be selected');
    }
    
    onboarding.productTypes = updateDto.productTypes;
    onboarding.currentStep = OnboardingStep.STORE_SETUP;
    
    return await this.onboardingRepository.save(onboarding);
  }

  async updateStoreSetup(userId: string, updateDto: UpdateStoreSetupDto): Promise<StoreOnboarding> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    // Check if store URL is already taken
    const existingStore = await this.storeRepository.findOne({
      where: { storeUrl: updateDto.storeUrl }
    });
    
    if (existingStore) {
      throw new ConflictException('Store URL is already taken. Please choose a different one.');
    }
    
    onboarding.storeName = updateDto.storeName;
    onboarding.storeUrl = updateDto.storeUrl;
    onboarding.storeDescription = updateDto.storeDescription || null;
    onboarding.currency = updateDto.currency || 'USD';
    onboarding.logoUrl = updateDto.logoUrl || null;
    onboarding.bannerUrl = updateDto.bannerUrl || null;
    
    return await this.onboardingRepository.save(onboarding);
  }

  async completeOnboarding(userId: string, completeDto: CompleteOnboardingDto, createStore: boolean = true): Promise<{ onboarding: StoreOnboarding; store?: Store }> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    // Validate that all required steps are completed
    if (!onboarding.businessType || !onboarding.salesChannels || !onboarding.productTypes) {
      throw new BadRequestException('Please complete all onboarding steps before completing onboarding');
    }
    
    let savedStore: Store | undefined;
    
    if (createStore) {
      // Check if store URL is already taken
      const existingStore = await this.storeRepository.findOne({
        where: { storeUrl: completeDto.storeUrl }
      });
      
      if (existingStore) {
        throw new ConflictException('Store URL is already taken. Please choose a different one.');
      }
      
      // Create the actual store
      const store = new Store();
      store.userId = userId;
      store.name = completeDto.storeName;
      store.storeUrl = completeDto.storeUrl;
      store.description = completeDto.storeDescription || null;
      store.currency = (completeDto.currency as StoreCurrency) || StoreCurrency.USD;
      store.logoUrl = completeDto.logoUrl || null;
      store.bannerUrl = completeDto.bannerUrl || null;
      store.status = StoreStatus.DRAFT;
      
      savedStore = await this.storeRepository.save(store);
    }
    
    // Mark onboarding as completed
    onboarding.isCompleted = true;
    onboarding.currentStep = OnboardingStep.COMPLETED;
    onboarding.storeName = completeDto.storeName;
    onboarding.storeUrl = completeDto.storeUrl;
    onboarding.storeDescription = completeDto.storeDescription || null;
    onboarding.currency = completeDto.currency || 'USD';
    onboarding.logoUrl = completeDto.logoUrl || null;
    onboarding.bannerUrl = completeDto.bannerUrl || null;
    
    const savedOnboarding = await this.onboardingRepository.save(onboarding);
    
    return {
      onboarding: savedOnboarding,
      store: savedStore
    };
  }

  async resetOnboarding(userId: string): Promise<StoreOnboarding> {
    const onboarding = await this.getOnboardingByUserId(userId);
    
    // Reset all fields
    onboarding.currentStep = OnboardingStep.WELCOME;
    onboarding.businessType = null;
    onboarding.salesChannels = null;
    onboarding.productTypes = null;
    onboarding.storeName = null;
    onboarding.storeUrl = null;
    onboarding.storeDescription = null;
    onboarding.currency = null;
    onboarding.logoUrl = null;
    onboarding.bannerUrl = null;
    onboarding.isCompleted = false;
    
    return await this.onboardingRepository.save(onboarding);
  }

  async deleteOnboarding(userId: string): Promise<void> {
    const onboarding = await this.getOnboardingByUserId(userId);
    await this.onboardingRepository.remove(onboarding);
  }

  // Helper methods
  private async getOnboardingByUserId(userId: string): Promise<StoreOnboarding> {
    const onboarding = await this.onboardingRepository.findOne({
      where: { userId }
    });

    if (!onboarding) {
      throw new NotFoundException('No onboarding session found. Please start onboarding first.');
    }

    return onboarding;
  }

  private getNextSteps(onboarding: StoreOnboarding): string[] {
    const steps: string[] = [];

    if (!onboarding.businessType) {
      steps.push('business_type');
    }

    if (!onboarding.salesChannels || onboarding.salesChannels.length === 0) {
      steps.push('sales_channels');
    }

    if (!onboarding.productTypes || onboarding.productTypes.length === 0) {
      steps.push('product_types');
    }

    if (!onboarding.storeName || !onboarding.storeUrl) {
      steps.push('store_setup');
    }

    return steps;
  }

  // Get available options for frontend
  getBusinessTypes() {
    return Object.values(BusinessType).map(type => ({
      value: type,
      label: this.formatBusinessTypeLabel(type),
      description: this.getBusinessTypeDescription(type)
    }));
  }

  getSalesChannels() {
    return Object.values(SalesChannel).map(channel => ({
      value: channel,
      label: this.formatSalesChannelLabel(channel),
      description: this.getSalesChannelDescription(channel),
      icon: this.getSalesChannelIcon(channel)
    }));
  }

  getProductTypes() {
    return Object.values(ProductType).map(type => ({
      value: type,
      label: this.formatProductTypeLabel(type),
      description: this.getProductTypeDescription(type),
      icon: this.getProductTypeIcon(type)
    }));
  }

  private formatBusinessTypeLabel(type: BusinessType): string {
    switch (type) {
      case BusinessType.JUST_STARTING:
        return "I'm just starting";
      case BusinessType.ALREADY_SELLING:
        return "I'm already selling online or in person";
      default:
        return type;
    }
  }

  private getBusinessTypeDescription(type: BusinessType): string {
    switch (type) {
      case BusinessType.JUST_STARTING:
        return "I'm new to selling and need help getting started";
      case BusinessType.ALREADY_SELLING:
        return "I already have experience selling products or services";
      default:
        return '';
    }
  }

  private formatSalesChannelLabel(channel: SalesChannel): string {
    switch (channel) {
      case SalesChannel.ONLINE_STORE:
        return "An online store";
      case SalesChannel.SOCIAL_MEDIA:
        return "Social media";
      case SalesChannel.IN_PERSON:
        return "In person";
      case SalesChannel.MARKETPLACES:
        return "Online marketplaces";
      case SalesChannel.EXISTING_WEBSITE:
        return "An existing website or blog";
      case SalesChannel.NOT_SURE:
        return "I'm not sure";
      default:
        return channel;
    }
  }

  private getSalesChannelDescription(channel: SalesChannel): string {
    switch (channel) {
      case SalesChannel.ONLINE_STORE:
        return "Create a fully customizable website";
      case SalesChannel.SOCIAL_MEDIA:
        return "Reach customers on Facebook, Instagram, TikTok, and more";
      case SalesChannel.IN_PERSON:
        return "Sell at retail stores, pop-ups, or other physical locations";
      case SalesChannel.MARKETPLACES:
        return "List products on Google, Amazon, and more";
      case SalesChannel.EXISTING_WEBSITE:
        return "Add a Buy Button to your website";
      case SalesChannel.NOT_SURE:
        return "We'll help you figure it out";
      default:
        return '';
    }
  }

  private getSalesChannelIcon(channel: SalesChannel): string {
    switch (channel) {
      case SalesChannel.ONLINE_STORE:
        return "store";
      case SalesChannel.SOCIAL_MEDIA:
        return "share";
      case SalesChannel.IN_PERSON:
        return "location";
      case SalesChannel.MARKETPLACES:
        return "shopping-bag";
      case SalesChannel.EXISTING_WEBSITE:
        return "globe";
      case SalesChannel.NOT_SURE:
        return "help-circle";
      default:
        return "circle";
    }
  }

  private formatProductTypeLabel(type: ProductType): string {
    switch (type) {
      case ProductType.PHYSICAL_PRODUCTS:
        return "Products I buy or make myself";
      case ProductType.DIGITAL_PRODUCTS:
        return "Digital products";
      case ProductType.SERVICES:
        return "Services";
      case ProductType.DROPSHIPPING:
        return "Dropshipping products";
      case ProductType.PRINT_ON_DEMAND:
        return "Print-on-demand products";
      case ProductType.DECIDE_LATER:
        return "I'll decide later";
      default:
        return type;
    }
  }

  private getProductTypeDescription(type: ProductType): string {
    switch (type) {
      case ProductType.PHYSICAL_PRODUCTS:
        return "Shipped by me";
      case ProductType.DIGITAL_PRODUCTS:
        return "Music, digital art, NFTs";
      case ProductType.SERVICES:
        return "Coaching, housekeeping, consulting";
      case ProductType.DROPSHIPPING:
        return "Sourced and shipped by a third party";
      case ProductType.PRINT_ON_DEMAND:
        return "My designs, printed and shipped by a third party";
      case ProductType.DECIDE_LATER:
        return "I'll figure it out as I go";
      default:
        return '';
    }
  }

  private getProductTypeIcon(type: ProductType): string {
    switch (type) {
      case ProductType.PHYSICAL_PRODUCTS:
        return "package";
      case ProductType.DIGITAL_PRODUCTS:
        return "file";
      case ProductType.SERVICES:
        return "users";
      case ProductType.DROPSHIPPING:
        return "truck";
      case ProductType.PRINT_ON_DEMAND:
        return "shirt";
      case ProductType.DECIDE_LATER:
        return "clock";
      default:
        return "circle";
    }
  }
}
