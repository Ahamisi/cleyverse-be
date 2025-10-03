import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SocialLinkService } from '../services/social-link.service';
import { CreateSocialLinkDto, UpdateSocialLinkDto, UpdateSocialIconSettingsDto } from '../dto/link.dto';
import { SocialPlatform } from '../entities/social-link.entity';

@Controller('social-links')
export class SocialLinksController {
  constructor(
    private readonly socialLinkService: SocialLinkService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSocialLink(@Request() req, @Body() createSocialLinkDto: CreateSocialLinkDto) {
    const socialLink = await this.socialLinkService.createSocialLink(req.user.userId, createSocialLinkDto);
    return {
      message: `${createSocialLinkDto.platform} link added successfully`,
      socialLink
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserSocialLinks(@Request() req, @Query('includeInactive') includeInactive?: string) {
    const includeInactiveFlag = includeInactive === 'true';
    const socialLinks = await this.socialLinkService.getUserSocialLinks(req.user.userId, includeInactiveFlag);
    return {
      message: 'Social links retrieved successfully',
      socialLinks,
      total: socialLinks.length
    };
  }

  @Get('platforms')
  @UseGuards(JwtAuthGuard)
  async getSupportedPlatforms() {
    const platforms = this.socialLinkService.getSupportedPlatforms();
    return {
      message: 'Supported platforms retrieved successfully',
      platforms
    };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getSocialLinkAnalytics(@Request() req) {
    const analytics = await this.socialLinkService.getSocialLinkAnalytics(req.user.userId);
    return {
      message: 'Social link analytics retrieved successfully',
      analytics
    };
  }

  @Get('platform/:platform')
  @UseGuards(JwtAuthGuard)
  async getSocialLinkByPlatform(@Request() req, @Param('platform') platform: SocialPlatform) {
    const socialLink = await this.socialLinkService.getSocialLinkByPlatform(req.user.userId, platform);
    
    if (!socialLink) {
      return {
        message: `No ${platform} link found`,
        socialLink: null
      };
    }

    return {
      message: `${platform} link retrieved successfully`,
      socialLink
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSocialLinkById(@Request() req, @Param('id') id: string) {
    const socialLink = await this.socialLinkService.findById(id);
    
    // Verify ownership
    if (socialLink.userId !== req.user.userId) {
      throw new Error('Social link not found or access denied');
    }

    return {
      message: 'Social link retrieved successfully',
      socialLink
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateSocialLink(
    @Request() req, 
    @Param('id') id: string, 
    @Body() updateSocialLinkDto: UpdateSocialLinkDto
  ) {
    const socialLink = await this.socialLinkService.updateSocialLink(req.user.userId, id, updateSocialLinkDto);
    return {
      message: 'Social link updated successfully',
      socialLink
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSocialLink(@Request() req, @Param('id') id: string) {
    await this.socialLinkService.deleteSocialLink(req.user.userId, id);
    return {
      message: 'Social link deleted successfully'
    };
  }

  @Put('icon-settings')
  @UseGuards(JwtAuthGuard)
  async updateSocialIconSettings(@Request() req, @Body() settingsDto: UpdateSocialIconSettingsDto) {
    const socialLinks = await this.socialLinkService.updateSocialIconSettings(req.user.userId, settingsDto);
    return {
      message: 'Social icon settings updated successfully',
      socialLinks
    };
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorderSocialLinks(@Request() req, @Body() body: { linkIds: string[] }) {
    const socialLinks = await this.socialLinkService.reorderSocialLinks(req.user.userId, body.linkIds);
    return {
      message: 'Social links reordered successfully',
      socialLinks
    };
  }

  @Post(':id/click')
  async incrementClickCount(@Param('id') id: string) {
    // This endpoint might be called from public link access
    // Consider adding rate limiting in production
    await this.socialLinkService.incrementClickCount(id);
    return {
      message: 'Social link click recorded successfully'
    };
  }
}
