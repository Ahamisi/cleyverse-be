import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { LinkService } from '../services/link.service';
import { 
  CreateLinkDto, 
  UpdateLinkDto, 
  ReorderLinksDto,
  ScheduleLinkDto,
  LockLinkDto,
  UnlockLinkDto,
  UpdateMediaDto,
  CustomizeLinkDto,
  ArchiveLinkDto,
  ShareLinkDto,
  TrackClickDto
} from '../dto/link.dto';
import { LinkType } from '../entities/link.entity';
import { MediaProcessorService } from '../../../shared/services/media-processor.service';
import * as platformsData from '../../../config/platforms.json';

@Controller('links')
export class LinksController {
  constructor(
    private readonly linkService: LinkService,
    private readonly mediaProcessorService: MediaProcessorService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createLink(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    const link = await this.linkService.createLink(req.user.userId, createLinkDto);
    return {
      message: 'Link created successfully',
      link
    };
  }

  // 🆕 URL PREVIEW ENDPOINT
  @Post('preview')
  @UseGuards(JwtAuthGuard)
  async previewUrl(@Body() body: { url: string }) {
    const metadata = await this.mediaProcessorService.processUrl(body.url);
    return {
      message: 'URL processed successfully',
      metadata,
      suggestions: {
        title: metadata.type === 'music' 
          ? `${metadata.title}${metadata.artist ? ' - ' + metadata.artist : ''}`
          : metadata.title || 'Custom Link',
        mediaType: metadata.type === 'music' ? 'music' : metadata.type === 'video' ? 'video' : null,
        thumbnailUrl: metadata.thumbnailUrl,
        previewData: metadata.type === 'music' ? {
          platform: metadata.platform,
          streamingServices: metadata.streamingServices
        } : metadata.type === 'video' ? {
          platform: metadata.platform,
          videoOptions: metadata.videoOptions
        } : null
      }
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserLinks(
    @Request() req, 
    @Query('includeInactive') includeInactive?: string,
    @Query('type') type?: LinkType
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    
    let links;
    if (type) {
      links = await this.linkService.getLinksByType(req.user.userId, type);
    } else {
      links = await this.linkService.getUserLinks(req.user.userId, includeInactiveFlag);
    }

    return {
      message: 'Links retrieved successfully',
      links,
      total: links.length
    };
  }

  @Get('featured')
  @UseGuards(JwtAuthGuard)
  async getFeaturedLinks(@Request() req) {
    const links = await this.linkService.getFeaturedLinks(req.user.userId);
    return {
      message: 'Featured links retrieved successfully',
      links,
      total: links.length
    };
  }

  // 🆕 SUPPORTED PLATFORMS ENDPOINT
  @Get('supported-platforms')
  async getSupportedPlatforms(@Query('category') category?: string, @Query('search') search?: string) {
    let platforms = platformsData.platforms;

    // Filter by category if provided
    if (category) {
      platforms = platforms.filter(platform => platform.category === category);
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      platforms = platforms.filter(platform => 
        platform.name.toLowerCase().includes(searchLower) ||
        platform.description.toLowerCase().includes(searchLower) ||
        platform.domain.toLowerCase().includes(searchLower)
      );
    }

    // Group by category for better organization
    const groupedPlatforms = platforms.reduce((acc, platform) => {
      if (!acc[platform.category]) {
        acc[platform.category] = [];
      }
      acc[platform.category].push(platform);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      message: 'Supported platforms retrieved successfully',
      platforms: groupedPlatforms,
      total: platforms.length,
      categories: Object.keys(groupedPlatforms),
      iconBaseUrl: '/icons', // Frontend will use this to construct icon paths
      namingConvention: {
        format: '{category}/{id}.svg',
        examples: ['social/instagram.svg', 'media/spotify.svg', 'commerce/shopify.svg'],
        note: 'All icons should be lowercase with hyphens for multi-word names'
      }
    };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getLinkAnalytics(@Request() req, @Query('linkId') linkId?: string) {
    const analytics = await this.linkService.getLinkAnalytics(req.user.userId, linkId);
    return {
      message: 'Analytics retrieved successfully',
      analytics
    };
  }

  @Get(':id/analytics/public')
  async getPublicLinkAnalytics(@Param('id') id: string) {
    const analytics = await this.linkService.getPublicLinkAnalytics(id);
    return {
      message: 'Analytics retrieved successfully',
      analytics
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getLinkById(@Request() req, @Param('id') id: string) {
    // Note: This will be used for link management, not for public link access
    const link = await this.linkService.findById(id);
    
    // Verify ownership
    if (link.userId !== req.user.userId) {
      throw new Error('Link not found or access denied');
    }

    return {
      message: 'Link retrieved successfully',
      link
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateLink(
    @Request() req, 
    @Param('id') id: string, 
    @Body() updateLinkDto: UpdateLinkDto
  ) {
    const link = await this.linkService.updateLink(req.user.userId, id, updateLinkDto);
    return {
      message: 'Link updated successfully',
      link
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteLink(@Request() req, @Param('id') id: string) {
    await this.linkService.deleteLink(req.user.userId, id);
    return {
      message: 'Link deleted successfully'
    };
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorderLinks(@Request() req, @Body() reorderDto: ReorderLinksDto) {
    const links = await this.linkService.reorderLinks(req.user.userId, reorderDto);
    return {
      message: 'Links reordered successfully',
      links
    };
  }

  @Post(':id/click')
  async trackClick(@Param('id') id: string, @Body() trackClickDto: TrackClickDto) {
    // This endpoint is called from public link access
    // Consider adding rate limiting in production
    const clickId = await this.linkService.trackClick(id, trackClickDto);
    return {
      message: 'Click recorded successfully',
      clickId
    };
  }

  // 🆕 ADVANCED LINK FEATURES ENDPOINTS

  // --- SCHEDULING ENDPOINTS ---
  @Put(':id/schedule')
  @UseGuards(JwtAuthGuard)
  async scheduleLink(@Request() req, @Param('id') id: string, @Body() scheduleDto: ScheduleLinkDto) {
    const link = await this.linkService.scheduleLink(req.user.userId, id, scheduleDto);
    return {
      message: 'Link scheduled successfully',
      link
    };
  }

  @Delete(':id/schedule')
  @UseGuards(JwtAuthGuard)
  async unscheduleLink(@Request() req, @Param('id') id: string) {
    const link = await this.linkService.unscheduleLink(req.user.userId, id);
    return {
      message: 'Link schedule removed successfully',
      link
    };
  }

  // --- LOCKING ENDPOINTS ---
  @Put(':id/lock')
  @UseGuards(JwtAuthGuard)
  async lockLink(@Request() req, @Param('id') id: string, @Body() lockDto: LockLinkDto) {
    const link = await this.linkService.lockLink(req.user.userId, id, lockDto);
    return {
      message: 'Link locked successfully',
      link
    };
  }

  @Post(':id/unlock')
  async unlockLink(@Param('id') id: string, @Body() unlockDto: UnlockLinkDto) {
    const result = await this.linkService.unlockLink(id, unlockDto);
    return {
      message: result.success ? 'Link unlocked successfully' : 'Failed to unlock link',
      success: result.success,
      link: result.link
    };
  }

  // --- MEDIA ENDPOINTS ---
  @Put(':id/media')
  @UseGuards(JwtAuthGuard)
  async updateMedia(@Request() req, @Param('id') id: string, @Body() mediaDto: UpdateMediaDto) {
    const link = await this.linkService.updateMedia(req.user.userId, id, mediaDto);
    return {
      message: 'Link media updated successfully',
      link
    };
  }

  // --- CUSTOMIZATION ENDPOINTS ---
  @Put(':id/customize')
  @UseGuards(JwtAuthGuard)
  async customizeLink(@Request() req, @Param('id') id: string, @Body() customizeDto: CustomizeLinkDto) {
    const link = await this.linkService.customizeLink(req.user.userId, id, customizeDto);
    return {
      message: 'Link customized successfully',
      link
    };
  }

  // --- ARCHIVE/RESTORE ENDPOINTS ---
  @Put(':id/archive')
  @UseGuards(JwtAuthGuard)
  async archiveLink(@Request() req, @Param('id') id: string) {
    const link = await this.linkService.archiveLink(req.user.userId, id);
    return {
      message: 'Link archived successfully',
      link
    };
  }

  @Put(':id/restore')
  @UseGuards(JwtAuthGuard)
  async restoreLink(@Request() req, @Param('id') id: string) {
    const link = await this.linkService.restoreLink(req.user.userId, id);
    return {
      message: 'Link restored successfully',
      link
    };
  }

  @Get('archived')
  @UseGuards(JwtAuthGuard)
  async getArchivedLinks(@Request() req) {
    const links = await this.linkService.getArchivedLinks(req.user.userId);
    return {
      message: 'Archived links retrieved successfully',
      links,
      total: links.length
    };
  }

  // --- SHARING ENDPOINTS ---
  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  async shareLink(@Request() req, @Param('id') id: string, @Body() shareDto: ShareLinkDto) {
    const result = await this.linkService.shareLink(req.user.userId, id, shareDto);
    return {
      message: 'Link shared successfully',
      shareUrl: result.shareUrl,
      platform: shareDto.platform
    };
  }

  @Get(':id/share-stats')
  @UseGuards(JwtAuthGuard)
  async getShareStats(@Request() req, @Param('id') id: string) {
    const stats = await this.linkService.getShareStats(req.user.userId, id);
    return {
      message: 'Share statistics retrieved successfully',
      stats
    };
  }
}
