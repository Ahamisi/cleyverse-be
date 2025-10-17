import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { StoreService } from '../services/store.service';
import { StoreOnboardingService } from '../services/store-onboarding.service';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';
import { TrackClickDto } from '../../links/dto/link.dto';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly onboardingService: StoreOnboardingService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createStoreDto: CreateStoreDto) {
    // Check if user has onboarding data to use
    let onboardingData: any = null;
    try {
      const onboardingStatus = await this.onboardingService.getOnboardingStatus(req.user.userId);
      if (onboardingStatus.isCompleted) {
        onboardingData = {
          businessType: onboardingStatus.businessType,
          salesChannels: onboardingStatus.salesChannels,
          productTypes: onboardingStatus.productTypes
        };
      }
    } catch (error) {
      // No onboarding data - that's fine, user can create store directly
    }

    const store = await this.storeService.createStore(req.user.userId, createStoreDto);
    
    return { 
      message: 'Store created successfully', 
      store,
      onboardingData // Include onboarding data if available
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('includeInactive') includeInactive: string = 'false') {
    const stores = await this.storeService.getUserStores(req.user.userId, includeInactive === 'true');
    return { 
      message: 'Stores retrieved successfully', 
      stores, 
      total: stores.length,
      hasStores: stores.length > 0,
      canCreateMore: stores.length < 10 // Limit per user
    };
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkUserStores(@Request() req) {
    const stores = await this.storeService.getUserStores(req.user.userId, false);
    return {
      message: 'User store status checked',
      hasStores: stores.length > 0,
      storeCount: stores.length,
      canCreateMore: stores.length < 10,
      maxStores: 10,
      stores: stores.map(store => ({
        id: store.id,
        name: store.name,
        storeUrl: store.storeUrl,
        status: store.status,
        totalProducts: store.totalProducts
      }))
    };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req, @Query('storeId') storeId?: string) {
    const analytics = await this.storeService.getStoreAnalytics(req.user.userId, storeId);
    return { message: 'Store analytics retrieved successfully', analytics };
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  async getOnboardingStatus(@Request() req) {
    try {
      const status = await this.onboardingService.getOnboardingStatus(req.user.userId);
      return {
        message: 'Onboarding status retrieved successfully',
        onboarding: status,
        hasOnboarding: true
      };
    } catch (error) {
      return {
        message: 'No onboarding session found',
        onboarding: null,
        hasOnboarding: false,
        canStartOnboarding: true
      };
    }
  }

  @Get('check-url/:storeUrl')
  async checkUrlAvailability(@Param('storeUrl') storeUrl: string) {
    const isAvailable = await this.storeService.checkStoreUrlAvailability(storeUrl);
    return { 
      message: 'Store URL availability checked', 
      storeUrl,
      isAvailable,
      suggestion: isAvailable ? null : `${storeUrl}-${Date.now().toString().slice(-4)}`
    };
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    const store = await this.storeService.getStoreById(req.user.userId, id);
    return { message: 'Store retrieved successfully', store };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    const store = await this.storeService.updateStore(req.user.userId, id, updateStoreDto);
    return { message: 'Store updated successfully', store };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Request() req, @Param('id') id: string, @Body() updateStatusDto: UpdateStoreStatusDto) {
    const store = await this.storeService.updateStoreStatus(req.user.userId, id, updateStatusDto);
    return { message: 'Store status updated successfully', store };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    await this.storeService.deleteStore(req.user.userId, id);
    return { message: 'Store deleted successfully (can be restored within 60 days)' };
  }

  @Put(':id/restore')
  @UseGuards(JwtAuthGuard)
  async restoreStore(@Request() req, @Param('id') id: string) {
    const store = await this.storeService.restoreStore(req.user.userId, id);
    return { message: 'Store restored successfully', store };
  }

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  async getDeletedStores(@Request() req) {
    const stores = await this.storeService.getDeletedStores(req.user.userId);
    return { message: 'Deleted stores retrieved successfully', stores, total: stores.length };
  }

  // Admin endpoints (will need admin guard later)
  @Put(':id/suspend')
  @UseGuards(JwtAuthGuard) // TODO: Add AdminGuard
  async suspendStore(@Param('id') id: string, @Body('reason') reason: string) {
    const store = await this.storeService.suspendStore(id, reason);
    return { message: 'Store suspended successfully', store };
  }

  @Put(':id/unsuspend')
  @UseGuards(JwtAuthGuard) // TODO: Add AdminGuard
  async unsuspendStore(@Param('id') id: string) {
    const store = await this.storeService.unsuspendStore(id);
    return { message: 'Store unsuspended successfully', store };
  }

  // ==================== PUBLIC ENDPOINTS ====================

  @Get('public/:storeUrl')
  async getPublicStore(@Param('storeUrl') storeUrl: string) {
    return this.storeService.getPublicStore(storeUrl);
  }

  @Get('public/:storeUrl/products')
  async getPublicStoreProducts(
    @Param('storeUrl') storeUrl: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string
  ) {
    return this.storeService.getPublicStoreProducts(storeUrl, {
      page: page || 1,
      limit: limit || 20,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'DESC'
    });
  }

         @Get('public/:storeUrl/products/:productHandle')
         async getPublicProduct(
           @Param('storeUrl') storeUrl: string,
           @Param('productHandle') productHandle: string
         ) {
           return this.storeService.getPublicProduct(storeUrl, productHandle);
         }

         @Post('public/:storeUrl/products/:productHandle/view')
         async trackProductView(
           @Param('storeUrl') storeUrl: string,
           @Param('productHandle') productHandle: string,
           @Body() trackClickDto: TrackClickDto
         ) {
           const viewId = await this.storeService.trackProductView(storeUrl, productHandle, trackClickDto);
           return {
             message: 'View recorded successfully',
             viewId
           };
         }
       }
