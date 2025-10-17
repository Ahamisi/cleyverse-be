"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreOnboardingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_onboarding_entity_1 = require("../entities/store-onboarding.entity");
const store_entity_1 = require("../entities/store.entity");
let StoreOnboardingService = class StoreOnboardingService {
    onboardingRepository;
    storeRepository;
    constructor(onboardingRepository, storeRepository) {
        this.onboardingRepository = onboardingRepository;
        this.storeRepository = storeRepository;
    }
    async startOnboarding(userId, startDto) {
        const existingOnboarding = await this.onboardingRepository.findOne({
            where: { userId }
        });
        if (existingOnboarding) {
            return existingOnboarding;
        }
        const onboarding = this.onboardingRepository.create({
            userId,
            currentStep: store_onboarding_entity_1.OnboardingStep.WELCOME
        });
        return await this.onboardingRepository.save(onboarding);
    }
    async getOnboardingStatus(userId) {
        const onboarding = await this.onboardingRepository.findOne({
            where: { userId }
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('No onboarding session found. Please start onboarding first.');
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
    async updateBusinessType(userId, updateDto) {
        const onboarding = await this.getOnboardingByUserId(userId);
        onboarding.businessType = updateDto.businessType;
        onboarding.currentStep = store_onboarding_entity_1.OnboardingStep.SALES_CHANNELS;
        return await this.onboardingRepository.save(onboarding);
    }
    async updateSalesChannels(userId, updateDto) {
        const onboarding = await this.getOnboardingByUserId(userId);
        if (updateDto.salesChannels.length === 0) {
            throw new common_1.BadRequestException('At least one sales channel must be selected');
        }
        onboarding.salesChannels = updateDto.salesChannels;
        onboarding.currentStep = store_onboarding_entity_1.OnboardingStep.PRODUCT_TYPE;
        return await this.onboardingRepository.save(onboarding);
    }
    async updateProductTypes(userId, updateDto) {
        const onboarding = await this.getOnboardingByUserId(userId);
        if (updateDto.productTypes.length === 0) {
            throw new common_1.BadRequestException('At least one product type must be selected');
        }
        onboarding.productTypes = updateDto.productTypes;
        onboarding.currentStep = store_onboarding_entity_1.OnboardingStep.STORE_SETUP;
        return await this.onboardingRepository.save(onboarding);
    }
    async updateStoreSetup(userId, updateDto) {
        const onboarding = await this.getOnboardingByUserId(userId);
        const existingStore = await this.storeRepository.findOne({
            where: { storeUrl: updateDto.storeUrl }
        });
        if (existingStore) {
            throw new common_1.ConflictException('Store URL is already taken. Please choose a different one.');
        }
        onboarding.storeName = updateDto.storeName;
        onboarding.storeUrl = updateDto.storeUrl;
        onboarding.storeDescription = updateDto.storeDescription || null;
        onboarding.currency = updateDto.currency || 'USD';
        onboarding.logoUrl = updateDto.logoUrl || null;
        onboarding.bannerUrl = updateDto.bannerUrl || null;
        return await this.onboardingRepository.save(onboarding);
    }
    async completeOnboarding(userId, completeDto, createStore = true) {
        const onboarding = await this.getOnboardingByUserId(userId);
        if (!onboarding.businessType || !onboarding.salesChannels || !onboarding.productTypes) {
            throw new common_1.BadRequestException('Please complete all onboarding steps before completing onboarding');
        }
        let savedStore;
        if (createStore) {
            const existingStore = await this.storeRepository.findOne({
                where: { storeUrl: completeDto.storeUrl }
            });
            if (existingStore) {
                throw new common_1.ConflictException('Store URL is already taken. Please choose a different one.');
            }
            const store = new store_entity_1.Store();
            store.userId = userId;
            store.name = completeDto.storeName;
            store.storeUrl = completeDto.storeUrl;
            store.description = completeDto.storeDescription || null;
            store.currency = completeDto.currency || store_entity_1.StoreCurrency.USD;
            store.logoUrl = completeDto.logoUrl || null;
            store.bannerUrl = completeDto.bannerUrl || null;
            store.status = store_entity_1.StoreStatus.DRAFT;
            savedStore = await this.storeRepository.save(store);
        }
        onboarding.isCompleted = true;
        onboarding.currentStep = store_onboarding_entity_1.OnboardingStep.COMPLETED;
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
    async resetOnboarding(userId) {
        const onboarding = await this.getOnboardingByUserId(userId);
        onboarding.currentStep = store_onboarding_entity_1.OnboardingStep.WELCOME;
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
    async deleteOnboarding(userId) {
        const onboarding = await this.getOnboardingByUserId(userId);
        await this.onboardingRepository.remove(onboarding);
    }
    async getOnboardingByUserId(userId) {
        const onboarding = await this.onboardingRepository.findOne({
            where: { userId }
        });
        if (!onboarding) {
            throw new common_1.NotFoundException('No onboarding session found. Please start onboarding first.');
        }
        return onboarding;
    }
    getNextSteps(onboarding) {
        const steps = [];
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
    getBusinessTypes() {
        return Object.values(store_onboarding_entity_1.BusinessType).map(type => ({
            value: type,
            label: this.formatBusinessTypeLabel(type),
            description: this.getBusinessTypeDescription(type)
        }));
    }
    getSalesChannels() {
        return Object.values(store_onboarding_entity_1.SalesChannel).map(channel => ({
            value: channel,
            label: this.formatSalesChannelLabel(channel),
            description: this.getSalesChannelDescription(channel),
            icon: this.getSalesChannelIcon(channel)
        }));
    }
    getProductTypes() {
        return Object.values(store_onboarding_entity_1.ProductType).map(type => ({
            value: type,
            label: this.formatProductTypeLabel(type),
            description: this.getProductTypeDescription(type),
            icon: this.getProductTypeIcon(type)
        }));
    }
    formatBusinessTypeLabel(type) {
        switch (type) {
            case store_onboarding_entity_1.BusinessType.JUST_STARTING:
                return "I'm just starting";
            case store_onboarding_entity_1.BusinessType.ALREADY_SELLING:
                return "I'm already selling online or in person";
            default:
                return type;
        }
    }
    getBusinessTypeDescription(type) {
        switch (type) {
            case store_onboarding_entity_1.BusinessType.JUST_STARTING:
                return "I'm new to selling and need help getting started";
            case store_onboarding_entity_1.BusinessType.ALREADY_SELLING:
                return "I already have experience selling products or services";
            default:
                return '';
        }
    }
    formatSalesChannelLabel(channel) {
        switch (channel) {
            case store_onboarding_entity_1.SalesChannel.ONLINE_STORE:
                return "An online store";
            case store_onboarding_entity_1.SalesChannel.SOCIAL_MEDIA:
                return "Social media";
            case store_onboarding_entity_1.SalesChannel.IN_PERSON:
                return "In person";
            case store_onboarding_entity_1.SalesChannel.MARKETPLACES:
                return "Online marketplaces";
            case store_onboarding_entity_1.SalesChannel.EXISTING_WEBSITE:
                return "An existing website or blog";
            case store_onboarding_entity_1.SalesChannel.NOT_SURE:
                return "I'm not sure";
            default:
                return channel;
        }
    }
    getSalesChannelDescription(channel) {
        switch (channel) {
            case store_onboarding_entity_1.SalesChannel.ONLINE_STORE:
                return "Create a fully customizable website";
            case store_onboarding_entity_1.SalesChannel.SOCIAL_MEDIA:
                return "Reach customers on Facebook, Instagram, TikTok, and more";
            case store_onboarding_entity_1.SalesChannel.IN_PERSON:
                return "Sell at retail stores, pop-ups, or other physical locations";
            case store_onboarding_entity_1.SalesChannel.MARKETPLACES:
                return "List products on Google, Amazon, and more";
            case store_onboarding_entity_1.SalesChannel.EXISTING_WEBSITE:
                return "Add a Buy Button to your website";
            case store_onboarding_entity_1.SalesChannel.NOT_SURE:
                return "We'll help you figure it out";
            default:
                return '';
        }
    }
    getSalesChannelIcon(channel) {
        switch (channel) {
            case store_onboarding_entity_1.SalesChannel.ONLINE_STORE:
                return "store";
            case store_onboarding_entity_1.SalesChannel.SOCIAL_MEDIA:
                return "share";
            case store_onboarding_entity_1.SalesChannel.IN_PERSON:
                return "location";
            case store_onboarding_entity_1.SalesChannel.MARKETPLACES:
                return "shopping-bag";
            case store_onboarding_entity_1.SalesChannel.EXISTING_WEBSITE:
                return "globe";
            case store_onboarding_entity_1.SalesChannel.NOT_SURE:
                return "help-circle";
            default:
                return "circle";
        }
    }
    formatProductTypeLabel(type) {
        switch (type) {
            case store_onboarding_entity_1.ProductType.PHYSICAL_PRODUCTS:
                return "Products I buy or make myself";
            case store_onboarding_entity_1.ProductType.DIGITAL_PRODUCTS:
                return "Digital products";
            case store_onboarding_entity_1.ProductType.SERVICES:
                return "Services";
            case store_onboarding_entity_1.ProductType.DROPSHIPPING:
                return "Dropshipping products";
            case store_onboarding_entity_1.ProductType.PRINT_ON_DEMAND:
                return "Print-on-demand products";
            case store_onboarding_entity_1.ProductType.DECIDE_LATER:
                return "I'll decide later";
            default:
                return type;
        }
    }
    getProductTypeDescription(type) {
        switch (type) {
            case store_onboarding_entity_1.ProductType.PHYSICAL_PRODUCTS:
                return "Shipped by me";
            case store_onboarding_entity_1.ProductType.DIGITAL_PRODUCTS:
                return "Music, digital art, NFTs";
            case store_onboarding_entity_1.ProductType.SERVICES:
                return "Coaching, housekeeping, consulting";
            case store_onboarding_entity_1.ProductType.DROPSHIPPING:
                return "Sourced and shipped by a third party";
            case store_onboarding_entity_1.ProductType.PRINT_ON_DEMAND:
                return "My designs, printed and shipped by a third party";
            case store_onboarding_entity_1.ProductType.DECIDE_LATER:
                return "I'll figure it out as I go";
            default:
                return '';
        }
    }
    getProductTypeIcon(type) {
        switch (type) {
            case store_onboarding_entity_1.ProductType.PHYSICAL_PRODUCTS:
                return "package";
            case store_onboarding_entity_1.ProductType.DIGITAL_PRODUCTS:
                return "file";
            case store_onboarding_entity_1.ProductType.SERVICES:
                return "users";
            case store_onboarding_entity_1.ProductType.DROPSHIPPING:
                return "truck";
            case store_onboarding_entity_1.ProductType.PRINT_ON_DEMAND:
                return "shirt";
            case store_onboarding_entity_1.ProductType.DECIDE_LATER:
                return "clock";
            default:
                return "circle";
        }
    }
};
exports.StoreOnboardingService = StoreOnboardingService;
exports.StoreOnboardingService = StoreOnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_onboarding_entity_1.StoreOnboarding)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoreOnboardingService);
//# sourceMappingURL=store-onboarding.service.js.map