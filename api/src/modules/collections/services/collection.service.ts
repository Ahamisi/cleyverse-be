import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseService } from '../../../common/base/base.service';
import { Collection, CollectionLayout, CollectionStatus } from '../entities/collection.entity';
import { Link } from '../../links/entities/link.entity';
import { User } from '../../users/entities/user.entity';
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

@Injectable()
export class CollectionService extends BaseService<Collection> {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(collectionRepository);
  }

  protected getEntityName(): string {
    return 'Collection';
  }

  async createCollection(userId: string, createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Auto-increment display order
    const maxOrder = await this.collectionRepository
      .createQueryBuilder('collection')
      .select('MAX(collection.displayOrder)', 'max')
      .where('collection.userId = :userId', { userId })
      .getRawOne();

    const displayOrder = createCollectionDto.displayOrder ?? (maxOrder?.max || 0) + 1;

    const collection = this.collectionRepository.create({
      ...createCollectionDto,
      userId,
      displayOrder,
      layout: createCollectionDto.layout || CollectionLayout.STACK,
    });

    return this.collectionRepository.save(collection);
  }

  async getUserCollections(userId: string, includeInactive = false): Promise<Collection[]> {
    // Use raw SQL to get collections - avoid TypeORM relationship issues
    let collectionsQuery = 'SELECT * FROM collections WHERE user_id = $1';
    if (!includeInactive) {
      collectionsQuery += ' AND is_active = true';
    }
    collectionsQuery += ' ORDER BY display_order ASC, created_at ASC';

    const collections = await this.collectionRepository.query(collectionsQuery, [userId]);

    // Manually attach links to each collection using raw SQL
    const collectionsWithLinks = await Promise.all(
      collections.map(async (collection: any) => {
        const links = await this.linkRepository.query(
          'SELECT * FROM links WHERE collection_id = $1 AND is_active = true ORDER BY display_order ASC',
          [collection.id]
        );
        
        return {
          ...collection,
          links: links,
          linkCount: links.length
        };
      })
    );

    return collectionsWithLinks as any;
  }

  async getCollectionById(userId: string, collectionId: string): Promise<Collection> {
    // Use pure SQL to get collection - NO TypeORM entities
    const collectionResult = await this.collectionRepository.query(
      'SELECT * FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, userId]
    );

    if (!collectionResult.length) {
      throw new NotFoundException('Collection not found or does not belong to user');
    }

    // Use pure SQL to get links - NO TypeORM entities
    const linksResult = await this.linkRepository.query(
      'SELECT * FROM links WHERE collection_id = $1 AND is_active = true ORDER BY display_order ASC',
      [collectionId]
    );

    // Create plain object (not TypeORM entity)
    const collection = {
      ...collectionResult[0],
      links: linksResult
    };

    console.log('🔍 DEBUG - Collection found:', !!collection);
    console.log('🔍 DEBUG - Links count in result:', linksResult.length);
    console.log('🔍 DEBUG - Link count field:', collection.link_count);

    return collection as any;
  }

  async updateCollection(userId: string, collectionId: string, updateDto: UpdateCollectionDto): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId, userId }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found or does not belong to user');
    }

    Object.assign(collection, updateDto);
    return this.collectionRepository.save(collection);
  }

  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId, userId }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found or does not belong to user');
    }

    // Move all links out of this collection
    await this.linkRepository.update(
      { collectionId },
      { collectionId: null }
    );

    // Delete the collection
    await this.collectionRepository.delete(collectionId);

    // Reorder remaining collections
    await this.reorderCollectionsAfterDeletion(userId, collection.displayOrder);
  }

  async reorderCollections(userId: string, collectionIds: string[]): Promise<Collection[]> {
    // Use raw SQL to update display orders - avoid TypeORM relationship issues
    for (let i = 0; i < collectionIds.length; i++) {
      const collectionId = collectionIds[i];
      await this.collectionRepository.query(
        'UPDATE collections SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
        [i, collectionId, userId]
      );
    }

    return this.getUserCollections(userId);
  }

  // 🆕 LINK MANAGEMENT WITHIN COLLECTIONS

  async addLinksToCollection(userId: string, collectionId: string, addLinksDto: AddLinksToCollectionDto): Promise<Collection> {
    // Verify collection exists using raw query - NO TypeORM entities
    const collectionCheck = await this.collectionRepository.query(
      'SELECT id FROM collections WHERE id = $1 AND user_id = $2',
      [collectionId, userId]
    );

    if (!collectionCheck.length) {
      throw new NotFoundException('Collection not found or does not belong to user');
    }
    
    // Verify all links belong to the user using raw query - NO TypeORM entities
    const linkCheckResult = await this.linkRepository.query(
      'SELECT id FROM links WHERE id = ANY($1) AND user_id = $2',
      [addLinksDto.linkIds, userId]
    );

    if (linkCheckResult.length !== addLinksDto.linkIds.length) {
      throw new BadRequestException('Some links not found or do not belong to user');
    }

    console.log('🔍 DEBUG - Updating links with collectionId:', collectionId);
    console.log('🔍 DEBUG - Link IDs to update:', addLinksDto.linkIds);
    
    // Use raw query to update - this CANNOT be interfered with by TypeORM
    const updateResult = await this.linkRepository.query(
      'UPDATE links SET collection_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = ANY($2) RETURNING id',
      [collectionId, addLinksDto.linkIds]
    );
    
    console.log('🔍 DEBUG - Raw update result:', updateResult);

    // Update collection link count using raw query
    const countResult = await this.linkRepository.query(
      'SELECT COUNT(*) as count FROM links WHERE collection_id = $1 AND is_active = true',
      [collectionId]
    );
    
    const updatedCount = parseInt(countResult[0].count);
    console.log('🔍 DEBUG - Updated count from raw query:', updatedCount);
    
    // Update collection count using raw query
    await this.collectionRepository.query(
      'UPDATE collections SET link_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [updatedCount, collectionId]
    );

    // Return result using pure SQL method
    return this.getCollectionById(userId, collectionId);
  }

  async removeLinksFromCollection(userId: string, collectionId: string, removeLinksDto: RemoveLinksFromCollectionDto): Promise<Collection> {
    const collection = await this.getCollectionById(userId, collectionId);

    // Remove links from collection
    await this.linkRepository.update(
      { 
        id: In(removeLinksDto.linkIds),
        collectionId,
        userId 
      },
      { collectionId: null }
    );

    // Update collection link count
    const updatedCount = await this.linkRepository.count({
      where: { collectionId, isActive: true }
    });
    collection.linkCount = updatedCount;
    await this.collectionRepository.save(collection);

    return this.getCollectionById(userId, collectionId);
  }

  async reorderLinksInCollection(userId: string, collectionId: string, reorderDto: ReorderLinksInCollectionDto): Promise<Collection> {
    const collection = await this.getCollectionById(userId, collectionId);

    if (!(collection as any).allow_reorder) {
      throw new BadRequestException('Reordering is not allowed for this collection');
    }

    // Use raw SQL to update link display orders - avoid TypeORM relationship issues
    for (let i = 0; i < reorderDto.linkIds.length; i++) {
      const linkId = reorderDto.linkIds[i];
      await this.linkRepository.query(
        'UPDATE links SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 AND collection_id = $4',
        [i, linkId, userId, collectionId]
      );
    }

    return this.getCollectionById(userId, collectionId);
  }

  // 🆕 COLLECTION CUSTOMIZATION

  async updateCollectionLayout(userId: string, collectionId: string, layoutDto: CollectionLayoutDto): Promise<Collection> {
    return this.updateCollection(userId, collectionId, { layout: layoutDto.layout });
  }

  async updateCollectionStyle(userId: string, collectionId: string, styleDto: CollectionStyleDto): Promise<Collection> {
    return this.updateCollection(userId, collectionId, styleDto);
  }

  async updateCollectionSettings(userId: string, collectionId: string, settingsDto: CollectionSettingsDto): Promise<Collection> {
    return this.updateCollection(userId, collectionId, settingsDto);
  }

  // 🆕 ARCHIVE/RESTORE

  async archiveCollection(userId: string, collectionId: string): Promise<Collection> {
    const collection = await this.getCollectionById(userId, collectionId);
    
    collection.status = CollectionStatus.ARCHIVED;
    collection.archivedAt = new Date();
    collection.isActive = false;

    return this.collectionRepository.save(collection);
  }

  async restoreCollection(userId: string, collectionId: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId, userId }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    collection.status = CollectionStatus.ACTIVE;
    collection.archivedAt = null;
    collection.isActive = true;

    return this.collectionRepository.save(collection);
  }

  async getArchivedCollections(userId: string): Promise<Collection[]> {
    // Use raw SQL to get archived collections - avoid TypeORM relationship issues
    return this.collectionRepository.query(
      'SELECT * FROM collections WHERE user_id = $1 AND status = $2 ORDER BY archived_at DESC',
      [userId, CollectionStatus.ARCHIVED]
    );
  }

  // 🆕 ANALYTICS

  async getCollectionAnalytics(userId: string, collectionId?: string): Promise<any> {
    // Use raw SQL to get collections - avoid TypeORM relationship issues
    let collectionsQuery = 'SELECT * FROM collections WHERE user_id = $1';
    let queryParams: any[] = [userId];
    
    if (collectionId) {
      collectionsQuery += ' AND id = $2';
      queryParams.push(collectionId);
    }

    const collections = await this.collectionRepository.query(collectionsQuery, queryParams);

    // Get click counts for each collection using raw SQL
    const collectionsWithClicks = await Promise.all(
      collections.map(async (collection: any) => {
        const clickResult = await this.linkRepository.query(
          'SELECT COALESCE(SUM(click_count), 0) as total_clicks FROM links WHERE collection_id = $1 AND is_active = true',
          [collection.id]
        );
        
        return {
          id: collection.id,
          title: collection.title,
          layout: collection.layout,
          linkCount: collection.link_count,
          totalClicks: parseInt(clickResult[0].total_clicks),
          isActive: collection.is_active,
          status: collection.status,
          createdAt: collection.created_at,
        };
      })
    );

    const totalCollections = collections.length;
    const totalLinks = collections.reduce((sum: number, collection: any) => sum + collection.link_count, 0);
    const totalClicks = collectionsWithClicks.reduce((sum, collection) => sum + collection.totalClicks, 0);

    return {
      collections: collectionsWithClicks,
      totalCollections,
      totalLinks,
      totalClicks,
      avgLinksPerCollection: totalCollections > 0 ? totalLinks / totalCollections : 0,
    };
  }

  // PRIVATE HELPERS

  private async reorderCollectionsAfterDeletion(userId: string, deletedOrder: number): Promise<void> {
    await this.collectionRepository
      .createQueryBuilder()
      .update(Collection)
      .set({ displayOrder: () => 'display_order - 1' })
      .where('userId = :userId', { userId })
      .andWhere('displayOrder > :deletedOrder', { deletedOrder })
      .execute();
  }
}
