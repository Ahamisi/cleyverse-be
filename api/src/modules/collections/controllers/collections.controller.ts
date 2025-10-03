import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CollectionService } from '../services/collection.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  ReorderCollectionsDto,
  AddLinksToCollectionDto,
  RemoveLinksFromCollectionDto,
  ReorderLinksInCollectionDto,
  CollectionLayoutDto,
  CollectionStyleDto,
  CollectionSettingsDto
} from '../dto/collection.dto';
import { CollectionLayout } from '../entities/collection.entity';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async createCollection(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    const collection = await this.collectionService.createCollection(req.user.userId, createCollectionDto);
    return {
      message: 'Collection created successfully',
      collection
    };
  }

  @Get()
  async getUserCollections(
    @Request() req,
    @Query('includeInactive') includeInactive: string = 'false'
  ) {
    const collections = await this.collectionService.getUserCollections(
      req.user.userId, 
      includeInactive === 'true'
    );
    return {
      message: 'Collections retrieved successfully',
      collections,
      total: collections.length
    };
  }

  @Get('analytics')
  async getAnalytics(@Request() req, @Query('collectionId') collectionId?: string) {
    const analytics = await this.collectionService.getCollectionAnalytics(req.user.userId, collectionId);
    return {
      message: 'Collection analytics retrieved successfully',
      analytics
    };
  }

  @Get('archived')
  async getArchivedCollections(@Request() req) {
    const collections = await this.collectionService.getArchivedCollections(req.user.userId);
    return {
      message: 'Archived collections retrieved successfully',
      collections,
      total: collections.length
    };
  }

  @Get('layouts')
  async getAvailableLayouts() {
    const layouts = Object.values(CollectionLayout).map(layout => ({
      value: layout,
      label: this.formatLayoutLabel(layout),
      description: this.getLayoutDescription(layout)
    }));
    
    return {
      message: 'Available layouts retrieved successfully',
      layouts
    };
  }

  @Put('reorder')
  async reorderCollections(@Request() req, @Body() reorderCollectionsDto: ReorderCollectionsDto) {
    const collections = await this.collectionService.reorderCollections(req.user.userId, reorderCollectionsDto.collectionIds);
    return {
      message: 'Collections reordered successfully',
      collections
    };
  }

  @Get(':id')
  async getCollection(@Request() req, @Param('id') id: string) {
    const collection = await this.collectionService.getCollectionById(req.user.userId, id);
    return {
      message: 'Collection retrieved successfully',
      collection
    };
  }

  @Put(':id')
  async updateCollection(
    @Request() req, 
    @Param('id') id: string, 
    @Body() updateCollectionDto: UpdateCollectionDto
  ) {
    const collection = await this.collectionService.updateCollection(req.user.userId, id, updateCollectionDto);
    return {
      message: 'Collection updated successfully',
      collection
    };
  }

  @Delete(':id')
  async deleteCollection(@Request() req, @Param('id') id: string) {
    await this.collectionService.deleteCollection(req.user.userId, id);
    return {
      message: 'Collection deleted successfully'
    };
  }

  // 🆕 LINK MANAGEMENT WITHIN COLLECTIONS

  @Post(':id/links')
  async addLinksToCollection(
    @Request() req, 
    @Param('id') id: string,
    @Body() addLinksDto: AddLinksToCollectionDto
  ) {
    const collection = await this.collectionService.addLinksToCollection(req.user.userId, id, addLinksDto);
    return {
      message: 'Links added to collection successfully',
      collection
    };
  }

  @Delete(':id/links')
  async removeLinksFromCollection(
    @Request() req, 
    @Param('id') id: string, 
    @Body() removeLinksDto: RemoveLinksFromCollectionDto
  ) {
    const collection = await this.collectionService.removeLinksFromCollection(req.user.userId, id, removeLinksDto);
    return {
      message: 'Links removed from collection successfully',
      collection
    };
  }

  @Put(':id/links/reorder')
  async reorderLinksInCollection(
    @Request() req, 
    @Param('id') id: string, 
    @Body() reorderDto: ReorderLinksInCollectionDto
  ) {
    const collection = await this.collectionService.reorderLinksInCollection(req.user.userId, id, reorderDto);
    return {
      message: 'Links reordered in collection successfully',
      collection
    };
  }

  // 🆕 COLLECTION CUSTOMIZATION

  @Put(':id/layout')
  async updateLayout(
    @Request() req, 
    @Param('id') id: string, 
    @Body() layoutDto: CollectionLayoutDto
  ) {
    const collection = await this.collectionService.updateCollectionLayout(req.user.userId, id, layoutDto);
    return {
      message: 'Collection layout updated successfully',
      collection
    };
  }

  @Put(':id/style')
  async updateStyle(
    @Request() req, 
    @Param('id') id: string, 
    @Body() styleDto: CollectionStyleDto
  ) {
    const collection = await this.collectionService.updateCollectionStyle(req.user.userId, id, styleDto);
    return {
      message: 'Collection style updated successfully',
      collection
    };
  }

  @Put(':id/settings')
  async updateSettings(
    @Request() req, 
    @Param('id') id: string, 
    @Body() settingsDto: CollectionSettingsDto
  ) {
    const collection = await this.collectionService.updateCollectionSettings(req.user.userId, id, settingsDto);
    return {
      message: 'Collection settings updated successfully',
      collection
    };
  }

  // 🆕 ARCHIVE/RESTORE

  @Put(':id/archive')
  async archiveCollection(@Request() req, @Param('id') id: string) {
    const collection = await this.collectionService.archiveCollection(req.user.userId, id);
    return {
      message: 'Collection archived successfully',
      collection
    };
  }

  @Put(':id/restore')
  async restoreCollection(@Request() req, @Param('id') id: string) {
    const collection = await this.collectionService.restoreCollection(req.user.userId, id);
    return {
      message: 'Collection restored successfully',
      collection
    };
  }

  // PRIVATE HELPERS

  private formatLayoutLabel(layout: CollectionLayout): string {
    const labels = {
      [CollectionLayout.STACK]: 'Stack',
      [CollectionLayout.GRID]: 'Grid',
      [CollectionLayout.CAROUSEL]: 'Carousel'
    };
    return labels[layout] || layout;
  }

  private getLayoutDescription(layout: CollectionLayout): string {
    const descriptions = {
      [CollectionLayout.STACK]: 'Display your links in the classic Linktree stack.',
      [CollectionLayout.GRID]: 'Organize links in a responsive grid layout.',
      [CollectionLayout.CAROUSEL]: 'Showcase links in a swipeable carousel format.'
    };
    return descriptions[layout] || '';
  }
}
