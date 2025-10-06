import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { StoreService } from '../services/store.service';
import { CreateStoreDto, UpdateStoreDto, UpdateStoreStatusDto } from '../dto/store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createStoreDto: CreateStoreDto) {
    const store = await this.storeService.createStore(req.user.userId, createStoreDto);
    return { message: 'Store created successfully', store };
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

  @Get('public/:storeUrl')
  async getPublicStore(@Param('storeUrl') storeUrl: string) {
    const store = await this.storeService.getPublicStore(storeUrl);
    return { message: 'Public store retrieved successfully', store };
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
}
