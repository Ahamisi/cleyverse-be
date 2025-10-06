import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { UserEventInteraction, InteractionType, UserEventSubscription } from '../entities/user-event-interaction.entity';

export class EventRecommendationFilters {
  location?: { latitude: number; longitude: number; radius: number }; // radius in km
  categories?: string[];
  tags?: string[];
  experienceLevel?: string;
  industry?: string;
  targetAudience?: string[];
  priceRange?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
  eventType?: string;
  locationType?: string;
}

export class ExploreEventsDto {
  page?: number = 1;
  limit?: number = 20;
  sortBy?: string = 'relevance'; // 'relevance', 'date', 'popularity', 'distance'
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
  filters?: EventRecommendationFilters;
}

@Injectable()
export class EventRecommendationService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(UserEventInteraction)
    private interactionRepository: Repository<UserEventInteraction>,
    @InjectRepository(UserEventSubscription)
    private subscriptionRepository: Repository<UserEventSubscription>,
  ) {}

  async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Event[]> {
    // Get user's interaction history
    const userInteractions = await this.interactionRepository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
      take: 100 // Consider last 100 interactions
    });

    // Extract user preferences
    const userPreferences = this.analyzeUserPreferences(userInteractions);

    // Build recommendation query
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
      .andWhere('event.visibility IN (:...visibility)', { visibility: ['public', 'unlisted'] })
      .andWhere('event.startDate > :now', { now: new Date() })
      .andWhere('event.creatorId != :userId', { userId }); // Don't recommend user's own events

    // Apply preference-based filtering
    if (userPreferences.categories.length > 0) {
      queryBuilder.andWhere('event.categories && :categories', { categories: userPreferences.categories });
    }

    if (userPreferences.tags.length > 0) {
      queryBuilder.andWhere('event.tags && :tags', { tags: userPreferences.tags });
    }

    if (userPreferences.industries.length > 0) {
      queryBuilder.andWhere('event.industry IN (:...industries)', { industries: userPreferences.industries });
    }

    // Exclude events user has already interacted with
    const interactedEventIds = userInteractions.map(i => i.eventId);
    if (interactedEventIds.length > 0) {
      queryBuilder.andWhere('event.id NOT IN (:...excludeIds)', { excludeIds: interactedEventIds });
    }

    // Order by engagement score and relevance
    queryBuilder
      .orderBy('event.engagementScore', 'DESC')
      .addOrderBy('event.viewCount', 'DESC')
      .addOrderBy('event.registrationCount', 'DESC')
      .limit(limit);

    return queryBuilder.getMany();
  }

  async getLocationBasedRecommendations(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 50, 
    limit: number = 10
  ): Promise<Event[]> {
    // Use Haversine formula for distance calculation
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
        sin(radians(latitude)))) AS distance
      FROM events 
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
        AND status IN ('published', 'live')
        AND visibility IN ('public', 'unlisted')
        AND start_date > NOW()
      HAVING distance < ?
      ORDER BY distance ASC, engagement_score DESC
      LIMIT ?
    `;

    return this.eventRepository.query(query, [latitude, longitude, latitude, radiusKm, limit]);
  }

  async exploreEvents(userId: string | null, exploreDto: ExploreEventsDto): Promise<{ events: Event[]; total: number }> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
      .andWhere('event.visibility = :visibility', { visibility: 'public' })
      .andWhere('event.startDate > :now', { now: new Date() });

    // Apply filters
    if (exploreDto.filters) {
      await this.applyFilters(queryBuilder, exploreDto.filters);
    }

    // Apply sorting
    this.applySorting(queryBuilder, exploreDto.sortBy || 'relevance', exploreDto.sortOrder || 'DESC');

    // Pagination
    const page = exploreDto.page || 1;
    const limit = exploreDto.limit || 20;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    // Track view interactions for logged-in users
    if (userId) {
      this.trackBulkInteraction(userId, events.map(e => e.id), InteractionType.VIEW);
    }

    return { events, total };
  }

  async getTrendingEvents(limit: number = 10): Promise<Event[]> {
    // Get events with high engagement in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.eventRepository.createQueryBuilder('event')
      .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
      .andWhere('event.visibility = :visibility', { visibility: 'public' })
      .andWhere('event.startDate > :now', { now: new Date() })
      .andWhere('event.updatedAt > :sevenDaysAgo', { sevenDaysAgo })
      .orderBy('event.engagementScore', 'DESC')
      .addOrderBy('event.registrationCount', 'DESC')
      .addOrderBy('event.viewCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return this.eventRepository.createQueryBuilder('event')
      .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
      .andWhere('event.visibility = :visibility', { visibility: 'public' })
      .andWhere('event.startDate > :now', { now: new Date() })
      .orderBy('event.startDate', 'ASC')
      .limit(limit)
      .getMany();
  }

  async trackInteraction(userId: string, eventId: string, type: InteractionType, metadata?: any): Promise<void> {
    try {
      const interaction = this.interactionRepository.create({
        userId,
        eventId,
        type,
        metadata
      });

      await this.interactionRepository.save(interaction);

      // Update event engagement metrics
      await this.updateEventEngagement(eventId, type);
    } catch (error) {
      // Handle duplicate key errors gracefully
      console.log('Interaction already exists or error:', error.message);
    }
  }

  async subscribeToEvent(userId: string, eventId: string): Promise<UserEventSubscription> {
    const subscription = this.subscriptionRepository.create({
      userId,
      eventId
    });

    await this.trackInteraction(userId, eventId, InteractionType.BOOKMARK);

    return this.subscriptionRepository.save(subscription);
  }

  async unsubscribeFromEvent(userId: string, eventId: string): Promise<void> {
    await this.subscriptionRepository.delete({ userId, eventId });
  }

  private analyzeUserPreferences(interactions: UserEventInteraction[]): {
    categories: string[];
    tags: string[];
    industries: string[];
    experienceLevels: string[];
  } {
    const preferences = {
      categories: [] as string[],
      tags: [] as string[],
      industries: [] as string[],
      experienceLevels: [] as string[]
    };

    const categoryCount: Record<string, number> = {};
    const tagCount: Record<string, number> = {};
    const industryCount: Record<string, number> = {};
    const experienceCount: Record<string, number> = {};

    interactions.forEach(interaction => {
      const event = interaction.event;
      if (!event) return;

      // Weight interactions differently
      const weight = this.getInteractionWeight(interaction.type);

      // Count categories
      if (event.categories) {
        event.categories.forEach(category => {
          categoryCount[category] = (categoryCount[category] || 0) + weight;
        });
      }

      // Count tags
      if (event.tags) {
        event.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + weight;
        });
      }

      // Count industries
      if (event.industry) {
        industryCount[event.industry] = (industryCount[event.industry] || 0) + weight;
      }

      // Count experience levels
      if (event.experienceLevel) {
        experienceCount[event.experienceLevel] = (experienceCount[event.experienceLevel] || 0) + weight;
      }
    });

    // Get top preferences
    preferences.categories = this.getTopItems(categoryCount, 5);
    preferences.tags = this.getTopItems(tagCount, 10);
    preferences.industries = this.getTopItems(industryCount, 3);
    preferences.experienceLevels = this.getTopItems(experienceCount, 2);

    return preferences;
  }

  private getInteractionWeight(type: InteractionType): number {
    const weights = {
      [InteractionType.VIEW]: 1,
      [InteractionType.LIKE]: 3,
      [InteractionType.BOOKMARK]: 5,
      [InteractionType.SHARE]: 4,
      [InteractionType.REGISTER]: 10,
      [InteractionType.ATTEND]: 15
    };
    return weights[type] || 1;
  }

  private getTopItems(countMap: Record<string, number>, limit: number): string[] {
    return Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item);
  }

  private async applyFilters(queryBuilder: any, filters: EventRecommendationFilters): Promise<void> {
    if (filters.categories?.length) {
      queryBuilder.andWhere('event.categories && :categories', { categories: filters.categories });
    }

    if (filters.tags?.length) {
      queryBuilder.andWhere('event.tags && :tags', { tags: filters.tags });
    }

    if (filters.industry) {
      queryBuilder.andWhere('event.industry = :industry', { industry: filters.industry });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('event.experienceLevel = :experienceLevel', { experienceLevel: filters.experienceLevel });
    }

    if (filters.targetAudience?.length) {
      queryBuilder.andWhere('event.targetAudience && :targetAudience', { targetAudience: filters.targetAudience });
    }

    if (filters.dateRange) {
      queryBuilder.andWhere('event.startDate BETWEEN :startDate AND :endDate', {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end
      });
    }

    if (filters.eventType) {
      queryBuilder.andWhere('event.eventType = :eventType', { eventType: filters.eventType });
    }

    if (filters.locationType) {
      queryBuilder.andWhere('event.locationType = :locationType', { locationType: filters.locationType });
    }

    // Location-based filtering
    if (filters.location) {
      const { latitude, longitude, radius } = filters.location;
      queryBuilder.andWhere(`
        (6371 * acos(cos(radians(:latitude)) * cos(radians(event.latitude)) * 
        cos(radians(event.longitude) - radians(:longitude)) + sin(radians(:latitude)) * 
        sin(radians(event.latitude)))) < :radius
      `, { latitude, longitude, radius });
    }
  }

  private applySorting(queryBuilder: any, sortBy: string, sortOrder: 'ASC' | 'DESC'): void {
    switch (sortBy) {
      case 'date':
        queryBuilder.orderBy('event.startDate', sortOrder);
        break;
      case 'popularity':
        queryBuilder.orderBy('event.registrationCount', sortOrder);
        break;
      case 'engagement':
        queryBuilder.orderBy('event.engagementScore', sortOrder);
        break;
      case 'views':
        queryBuilder.orderBy('event.viewCount', sortOrder);
        break;
      case 'distance':
        // Distance sorting should be handled in location-based queries
        queryBuilder.orderBy('event.startDate', 'ASC');
        break;
      default: // 'relevance'
        queryBuilder
          .orderBy('event.engagementScore', 'DESC')
          .addOrderBy('event.registrationCount', 'DESC')
          .addOrderBy('event.viewCount', 'DESC');
    }
  }

  private async trackBulkInteraction(userId: string, eventIds: string[], type: InteractionType): Promise<void> {
    // Track interactions in bulk for performance
    const interactions = eventIds.map(eventId => ({
      userId,
      eventId,
      type
    }));

    try {
      await this.interactionRepository.save(interactions);
    } catch (error) {
      // Handle gracefully - bulk operations might have duplicates
      console.log('Bulk interaction tracking error:', error.message);
    }
  }

  private async updateEventEngagement(eventId: string, interactionType: InteractionType): Promise<void> {
    const weight = this.getInteractionWeight(interactionType);
    
    // Update specific counters
    switch (interactionType) {
      case InteractionType.LIKE:
        await this.eventRepository.increment({ id: eventId }, 'likeCount', 1);
        break;
      case InteractionType.BOOKMARK:
        await this.eventRepository.increment({ id: eventId }, 'bookmarkCount', 1);
        break;
    }

    // Update overall engagement score
    await this.eventRepository.increment({ id: eventId }, 'engagementScore', weight);
  }
}
