import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { Link, LinkType, LinkStatus, LinkLockType, MediaType, LinkLayout } from '../entities/link.entity';
import { User } from '../../users/entities/user.entity';
import { 
  CreateLinkDto, 
  UpdateLinkDto, 
  ReorderLinksDto,
  ScheduleLinkDto,
  LockLinkDto,
  UnlockLinkDto,
  UpdateMediaDto,
  CustomizeLinkDto,
  ShareLinkDto
} from '../dto/link.dto';
import { MediaProcessorService, MediaMetadata } from '../../../shared/services/media-processor.service';
import * as crypto from 'crypto';

@Injectable()
export class LinkService extends BaseService<Link> {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mediaProcessorService: MediaProcessorService,
  ) {
    super(linkRepository);
  }

  protected getEntityName(): string {
    return 'Link';
  }

  async createLink(userId: string, createLinkDto: CreateLinkDto): Promise<Link> {
    // Check for duplicate URLs for the same user
    const existingLink = await this.linkRepository.findOne({
      where: { userId, url: createLinkDto.url }
    });

    if (existingLink) {
      throw new BadRequestException('Link with this URL already exists');
    }

    // 🆕 SMART MEDIA DETECTION
    const mediaMetadata = await this.mediaProcessorService.processUrl(createLinkDto.url);
    
    // Auto-increment display order
    const maxOrder = await this.linkRepository
      .createQueryBuilder('link')
      .select('MAX(link.displayOrder)', 'max')
      .where('link.userId = :userId', { userId })
      .getRawOne();

    const displayOrder = createLinkDto.displayOrder ?? (maxOrder?.max || 0) + 1;

    // Determine media type and enhance data based on detection
    let mediaType: MediaType | undefined;
    let previewData: any = null;
    let autoTitle = createLinkDto.title;
    let thumbnailUrl = createLinkDto.thumbnailUrl;

    if (mediaMetadata.type === 'music') {
      mediaType = MediaType.MUSIC;
      autoTitle = autoTitle || `${mediaMetadata.title}${mediaMetadata.artist ? ' - ' + mediaMetadata.artist : ''}`;
      thumbnailUrl = thumbnailUrl || mediaMetadata.thumbnailUrl;
      previewData = {
        platform: mediaMetadata.platform,
        title: mediaMetadata.title,
        artist: mediaMetadata.artist,
        album: mediaMetadata.album,
        duration: mediaMetadata.duration,
        streamingServices: mediaMetadata.streamingServices,
      };
    } else if (mediaMetadata.type === 'video') {
      mediaType = MediaType.VIDEO;
      autoTitle = autoTitle || mediaMetadata.title || 'Video Link';
      thumbnailUrl = thumbnailUrl || mediaMetadata.thumbnailUrl;
      previewData = {
        platform: mediaMetadata.platform,
        title: mediaMetadata.title,
        duration: mediaMetadata.duration,
        embedUrl: mediaMetadata.embedUrl,
        videoOptions: mediaMetadata.videoOptions,
      };
    }

    return this.create({
      ...createLinkDto,
      title: autoTitle,
      userId,
      displayOrder,
      type: createLinkDto.type || LinkType.REGULAR,
      mediaType,
      thumbnailUrl,
      previewData,
    });
  }

  async getUserLinks(userId: string, includeInactive = false): Promise<Link[]> {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .where('link.userId = :userId', { userId })
      .orderBy('link.displayOrder', 'ASC')
      .addOrderBy('link.createdAt', 'ASC');

    if (!includeInactive) {
      queryBuilder.andWhere('link.isActive = :isActive', { isActive: true });
    }

    return queryBuilder.getMany();
  }

  async updateLink(userId: string, linkId: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId, userId }
    });

    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    // Check for duplicate URLs if URL is being updated
    if (updateLinkDto.url && updateLinkDto.url !== link.url) {
      const existingLink = await this.linkRepository.findOne({
        where: { userId, url: updateLinkDto.url }
      });

      if (existingLink && existingLink.id !== linkId) {
        throw new BadRequestException('Link with this URL already exists');
      }
    }

    await this.repository.update(linkId, updateLinkDto);
    return this.findById(linkId);
  }

  async deleteLink(userId: string, linkId: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId, userId }
    });

    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    await this.repository.delete(linkId);

    // Reorder remaining links
    await this.reorderLinksAfterDeletion(userId, link.displayOrder);
  }

  async reorderLinks(userId: string, reorderDto: ReorderLinksDto): Promise<Link[]> {
    const { linkIds } = reorderDto;

    // Verify all links belong to the user
    const links = await this.linkRepository.find({
      where: { userId },
      select: ['id']
    });

    const userLinkIds = links.map(link => link.id);
    const invalidIds = linkIds.filter(id => !userLinkIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException('Some links do not belong to this user');
    }

    // Update display orders
    for (let i = 0; i < linkIds.length; i++) {
      await this.repository.update(linkIds[i], { displayOrder: i + 1 });
    }

    return this.getUserLinks(userId);
  }

  async incrementClickCount(linkId: string): Promise<void> {
    await this.repository.increment({ id: linkId }, 'clickCount', 1);
    await this.repository.update(linkId, { lastClickedAt: new Date() });
  }

  async getLinksByType(userId: string, type: LinkType): Promise<Link[]> {
    return this.linkRepository.find({
      where: { userId, type, isActive: true },
      order: { displayOrder: 'ASC', createdAt: 'ASC' }
    });
  }

  async getFeaturedLinks(userId: string): Promise<Link[]> {
    return this.linkRepository.find({
      where: { userId, isFeatured: true, isActive: true },
      order: { displayOrder: 'ASC', createdAt: 'ASC' }
    });
  }

  async getLinkAnalytics(userId: string, linkId?: string) {
    const queryBuilder = this.linkRepository
      .createQueryBuilder('link')
      .select([
        'link.id',
        'link.title', 
        'link.url',
        'link.clickCount',
        'link.lastClickedAt',
        'link.createdAt'
      ])
      .where('link.userId = :userId', { userId });

    if (linkId) {
      queryBuilder.andWhere('link.id = :linkId', { linkId });
      const link = await queryBuilder.getOne();
      if (!link) {
        throw new NotFoundException('Link not found');
      }
      return link;
    }

    const links = await queryBuilder.getMany();
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);

    return {
      links,
      totalLinks: links.length,
      totalClicks,
      avgClicksPerLink: links.length > 0 ? Math.round(totalClicks / links.length) : 0
    };
  }

  private async reorderLinksAfterDeletion(userId: string, deletedOrder: number): Promise<void> {
    await this.linkRepository
      .createQueryBuilder()
      .update(Link)
      .set({ displayOrder: () => 'display_order - 1' })
      .where('userId = :userId', { userId })
      .andWhere('displayOrder > :deletedOrder', { deletedOrder })
      .execute();
  }

  // 🆕 ADVANCED LINK FEATURES METHODS

  // --- SCHEDULING METHODS ---
  async scheduleLink(userId: string, linkId: string, scheduleDto: ScheduleLinkDto): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    const updateData: any = {};
    if (scheduleDto.scheduledStartAt) {
      updateData.scheduledStartAt = new Date(scheduleDto.scheduledStartAt);
    }
    if (scheduleDto.scheduledEndAt) {
      updateData.scheduledEndAt = new Date(scheduleDto.scheduledEndAt);
    }
    if (scheduleDto.timezone) {
      updateData.timezone = scheduleDto.timezone;
    }

    await this.linkRepository.update(linkId, updateData);
    return this.findById(linkId);
  }

  async unscheduleLink(userId: string, linkId: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    await this.linkRepository.update(linkId, {
      scheduledStartAt: undefined,
      scheduledEndAt: undefined,
      timezone: undefined
    });
    return this.findById(linkId);
  }

  async isLinkScheduledActive(linkId: string): Promise<boolean> {
    const link = await this.findById(linkId);
    const now = new Date();
    
    if (!link.scheduledStartAt && !link.scheduledEndAt) {
      return true; // No schedule = always active
    }
    
    if (link.scheduledStartAt && now < link.scheduledStartAt) {
      return false; // Not started yet
    }
    
    if (link.scheduledEndAt && now > link.scheduledEndAt) {
      return false; // Already ended
    }
    
    return true;
  }

  // --- LOCKING METHODS ---
  async lockLink(userId: string, linkId: string, lockDto: LockLinkDto): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    const updateData: any = {
      isLocked: lockDto.isLocked
    };

    if (lockDto.isLocked) {
      updateData.lockType = lockDto.lockType;
      updateData.lockDescription = lockDto.lockDescription;
      
      if (lockDto.lockType === LinkLockType.CODE && lockDto.lockCode) {
        updateData.lockCode = lockDto.lockCode;
      }
    } else {
      // Clear lock data when unlocking
      updateData.lockType = undefined;
      updateData.lockCode = undefined;
      updateData.lockDescription = undefined;
    }

    await this.linkRepository.update(linkId, updateData);
    return this.findById(linkId);
  }

  async unlockLink(linkId: string, unlockDto: UnlockLinkDto): Promise<{ success: boolean; link?: Link }> {
    const link = await this.findById(linkId);
    
    if (!link.isLocked) {
      return { success: true, link };
    }

    switch (link.lockType) {
      case LinkLockType.CODE:
        if (unlockDto.code === link.lockCode) {
          return { success: true, link };
        }
        break;
        
      case LinkLockType.SUBSCRIPTION:
        // In real implementation, check if email is subscribed
        if (unlockDto.email) {
          return { success: true, link };
        }
        break;
        
      case LinkLockType.AGE:
        // In real implementation, verify age from birth date
        if (unlockDto.birthDate) {
          const birthDate = new Date(unlockDto.birthDate);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          if (age >= 18) {
            return { success: true, link };
          }
        }
        break;
        
      case LinkLockType.SENSITIVE:
        // For sensitive content, just acknowledge
        return { success: true, link };
        
      case LinkLockType.NFT:
        // In real implementation, verify NFT ownership
        return { success: false };
    }

    return { success: false };
  }

  // --- MEDIA METHODS ---
  async updateMedia(userId: string, linkId: string, mediaDto: UpdateMediaDto): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    const updateData: any = {};
    if (mediaDto.mediaType) updateData.mediaType = mediaDto.mediaType;
    if (mediaDto.thumbnailUrl) updateData.thumbnailUrl = mediaDto.thumbnailUrl;
    if (mediaDto.previewData) updateData.previewData = mediaDto.previewData;

    await this.linkRepository.update(linkId, updateData);
    return this.findById(linkId);
  }

  // --- CUSTOMIZATION METHODS ---
  async customizeLink(userId: string, linkId: string, customizeDto: CustomizeLinkDto): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    const updateData: any = {};
    
    if (customizeDto.shortCode) {
      // Check if short code is available
      const existingLink = await this.linkRepository.findOne({ 
        where: { shortCode: customizeDto.shortCode } 
      });
      if (existingLink && existingLink.id !== linkId) {
        throw new BadRequestException('Short code already taken');
      }
      updateData.shortCode = customizeDto.shortCode;
      updateData.shareableShortUrl = `cley.me/${customizeDto.shortCode}`;
    }
    
    if (customizeDto.customDomain) {
      updateData.customDomain = customizeDto.customDomain;
    }

    await this.linkRepository.update(linkId, updateData);
    return this.findById(linkId);
  }

  // --- ARCHIVE/RESTORE METHODS ---
  async archiveLink(userId: string, linkId: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    await this.linkRepository.update(linkId, {
      status: LinkStatus.ARCHIVED,
      archivedAt: new Date(),
      isActive: false
    });
    return this.findById(linkId);
  }

  async restoreLink(userId: string, linkId: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    await this.linkRepository.update(linkId, {
      status: LinkStatus.ACTIVE,
      archivedAt: undefined,
      isActive: true
    });
    return this.findById(linkId);
  }

  async getArchivedLinks(userId: string): Promise<Link[]> {
    return this.linkRepository.find({
      where: { userId, status: LinkStatus.ARCHIVED },
      order: { archivedAt: 'DESC' }
    });
  }

  // --- SHARING METHODS ---
  async shareLink(userId: string, linkId: string, shareDto: ShareLinkDto): Promise<{ shareUrl: string }> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    // Generate share URL if not exists
    let shareUrl = link.shareableShortUrl;
    if (!shareUrl) {
      const shortCode = crypto.randomBytes(4).toString('hex');
      shareUrl = `cley.me/${shortCode}`;
      await this.linkRepository.update(linkId, {
        shortCode,
        shareableShortUrl: shareUrl
      });
    }

    // Increment share count
    await this.linkRepository.increment({ id: linkId }, 'socialShareCount', 1);

    return { shareUrl };
  }

  async getShareStats(userId: string, linkId: string): Promise<any> {
    const link = await this.linkRepository.findOne({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found or does not belong to user');
    }

    return {
      linkId: link.id,
      title: link.title,
      shareUrl: link.shareableShortUrl,
      socialShareCount: link.socialShareCount,
      clickCount: link.clickCount,
      shareToClickRatio: link.socialShareCount > 0 ? 
        (link.clickCount / link.socialShareCount).toFixed(2) : '0.00'
    };
  }
}
