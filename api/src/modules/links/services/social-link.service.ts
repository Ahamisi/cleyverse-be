import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { SocialLink, SocialPlatform, SocialIconPosition } from '../entities/social-link.entity';
import { CreateSocialLinkDto, UpdateSocialLinkDto, UpdateSocialIconSettingsDto } from '../dto/link.dto';

@Injectable()
export class SocialLinkService extends BaseService<SocialLink> {
  constructor(
    @InjectRepository(SocialLink)
    private readonly socialLinkRepository: Repository<SocialLink>,
  ) {
    super(socialLinkRepository);
  }

  protected getEntityName(): string {
    return 'SocialLink';
  }

  async createSocialLink(userId: string, createSocialLinkDto: CreateSocialLinkDto): Promise<SocialLink> {
    // Check if user already has this platform
    const existingLink = await this.socialLinkRepository.findOne({
      where: { userId, platform: createSocialLinkDto.platform }
    });

    if (existingLink) {
      throw new BadRequestException(`${createSocialLinkDto.platform} link already exists. Update instead.`);
    }

    // Auto-increment display order
    const maxOrder = await this.socialLinkRepository
      .createQueryBuilder('social_link')
      .select('MAX(social_link.displayOrder)', 'max')
      .where('social_link.userId = :userId', { userId })
      .getRawOne();

    const displayOrder = createSocialLinkDto.displayOrder ?? (maxOrder?.max || 0) + 1;

    return this.create({
      ...createSocialLinkDto,
      userId,
      displayOrder,
      iconPosition: createSocialLinkDto.iconPosition || SocialIconPosition.TOP
    });
  }

  async getUserSocialLinks(userId: string, includeInactive = false): Promise<SocialLink[]> {
    const queryBuilder = this.socialLinkRepository
      .createQueryBuilder('social_link')
      .where('social_link.userId = :userId', { userId })
      .orderBy('social_link.displayOrder', 'ASC')
      .addOrderBy('social_link.createdAt', 'ASC');

    if (!includeInactive) {
      queryBuilder.andWhere('social_link.isActive = :isActive', { isActive: true });
    }

    return queryBuilder.getMany();
  }

  async updateSocialLink(userId: string, socialLinkId: string, updateSocialLinkDto: UpdateSocialLinkDto): Promise<SocialLink> {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id: socialLinkId, userId }
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found or does not belong to user');
    }

    await this.repository.update(socialLinkId, updateSocialLinkDto);
    return this.findById(socialLinkId);
  }

  async deleteSocialLink(userId: string, socialLinkId: string): Promise<void> {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id: socialLinkId, userId }
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found or does not belong to user');
    }

    await this.repository.delete(socialLinkId);

    // Reorder remaining links
    await this.reorderSocialLinksAfterDeletion(userId, socialLink.displayOrder);
  }

  async updateSocialIconSettings(userId: string, settingsDto: UpdateSocialIconSettingsDto): Promise<SocialLink[]> {
    const { iconPosition, activePlatforms } = settingsDto;

    // Update icon position for all user's social links
    await this.socialLinkRepository.update(
      { userId },
      { iconPosition }
    );

    // If specific platforms provided, activate/deactivate accordingly
    if (activePlatforms && activePlatforms.length > 0) {
      // Deactivate all first
      await this.socialLinkRepository.update(
        { userId },
        { isActive: false }
      );

      // Activate specified platforms
      for (const platformId of activePlatforms) {
        await this.socialLinkRepository.update(
          { id: platformId, userId },
          { isActive: true }
        );
      }
    }

    return this.getUserSocialLinks(userId, true);
  }

  async incrementClickCount(socialLinkId: string): Promise<void> {
    await this.repository.increment({ id: socialLinkId }, 'clickCount', 1);
    await this.repository.update(socialLinkId, { lastClickedAt: new Date() });
  }

  async getSocialLinkByPlatform(userId: string, platform: SocialPlatform): Promise<SocialLink | null> {
    return this.socialLinkRepository.findOne({
      where: { userId, platform }
    });
  }

  async reorderSocialLinks(userId: string, linkIds: string[]): Promise<SocialLink[]> {
    // Verify all links belong to the user
    const links = await this.socialLinkRepository.find({
      where: { userId },
      select: ['id']
    });

    const userLinkIds = links.map(link => link.id);
    const invalidIds = linkIds.filter(id => !userLinkIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException('Some social links do not belong to this user');
    }

    // Update display orders
    for (let i = 0; i < linkIds.length; i++) {
      await this.repository.update(linkIds[i], { displayOrder: i + 1 });
    }

    return this.getUserSocialLinks(userId);
  }

  async getSocialLinkAnalytics(userId: string) {
    const socialLinks = await this.socialLinkRepository
      .createQueryBuilder('social_link')
      .select([
        'social_link.id',
        'social_link.platform',
        'social_link.username', 
        'social_link.clickCount',
        'social_link.lastClickedAt',
        'social_link.createdAt'
      ])
      .where('social_link.userId = :userId', { userId })
      .getMany();

    const totalClicks = socialLinks.reduce((sum, link) => sum + link.clickCount, 0);

    return {
      socialLinks,
      totalSocialLinks: socialLinks.length,
      totalClicks,
      avgClicksPerLink: socialLinks.length > 0 ? Math.round(totalClicks / socialLinks.length) : 0,
      topPlatforms: socialLinks
        .sort((a, b) => b.clickCount - a.clickCount)
        .slice(0, 5)
        .map(link => ({
          platform: link.platform,
          username: link.username,
          clicks: link.clickCount
        }))
    };
  }

  getSupportedPlatforms(): { value: SocialPlatform; label: string; urlPattern?: string }[] {
    return [
      { value: SocialPlatform.INSTAGRAM, label: 'Instagram', urlPattern: 'https://www.instagram.com/{username}' },
      { value: SocialPlatform.YOUTUBE, label: 'YouTube', urlPattern: 'https://www.youtube.com/@{username}' },
      { value: SocialPlatform.TIKTOK, label: 'TikTok', urlPattern: 'https://www.tiktok.com/@{username}' },
      { value: SocialPlatform.TWITTER, label: 'X (Twitter)', urlPattern: 'https://twitter.com/{username}' },
      { value: SocialPlatform.FACEBOOK, label: 'Facebook', urlPattern: 'https://facebook.com/{username}' },
      { value: SocialPlatform.LINKEDIN, label: 'LinkedIn', urlPattern: 'https://linkedin.com/in/{username}' },
      { value: SocialPlatform.PINTEREST, label: 'Pinterest', urlPattern: 'https://pinterest.com/{username}' },
      { value: SocialPlatform.SNAPCHAT, label: 'Snapchat', urlPattern: 'https://snapchat.com/add/{username}' },
      { value: SocialPlatform.SPOTIFY, label: 'Spotify', urlPattern: 'https://open.spotify.com/user/{username}' },
      { value: SocialPlatform.APPLE_MUSIC, label: 'Apple Music' },
      { value: SocialPlatform.SOUNDCLOUD, label: 'SoundCloud', urlPattern: 'https://soundcloud.com/{username}' },
      { value: SocialPlatform.TWITCH, label: 'Twitch', urlPattern: 'https://twitch.tv/{username}' },
      { value: SocialPlatform.THREADS, label: 'Threads', urlPattern: 'https://threads.net/@{username}' },
      { value: SocialPlatform.WHATSAPP, label: 'WhatsApp' },
      { value: SocialPlatform.EMAIL, label: 'Email' }
    ];
  }

  private async reorderSocialLinksAfterDeletion(userId: string, deletedOrder: number): Promise<void> {
    await this.socialLinkRepository
      .createQueryBuilder()
      .update(SocialLink)
      .set({ displayOrder: () => 'display_order - 1' })
      .where('userId = :userId', { userId })
      .andWhere('displayOrder > :deletedOrder', { deletedOrder })
      .execute();
  }
}
