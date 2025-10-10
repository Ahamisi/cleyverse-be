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
exports.EventRecommendationService = exports.ExploreEventsDto = exports.EventRecommendationFilters = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
const user_event_interaction_entity_1 = require("../entities/user-event-interaction.entity");
class EventRecommendationFilters {
    location;
    categories;
    tags;
    experienceLevel;
    industry;
    targetAudience;
    priceRange;
    dateRange;
    eventType;
    locationType;
}
exports.EventRecommendationFilters = EventRecommendationFilters;
class ExploreEventsDto {
    page = 1;
    limit = 20;
    sortBy = 'relevance';
    sortOrder = 'DESC';
    filters;
}
exports.ExploreEventsDto = ExploreEventsDto;
let EventRecommendationService = class EventRecommendationService {
    eventRepository;
    interactionRepository;
    subscriptionRepository;
    constructor(eventRepository, interactionRepository, subscriptionRepository) {
        this.eventRepository = eventRepository;
        this.interactionRepository = interactionRepository;
        this.subscriptionRepository = subscriptionRepository;
    }
    async getPersonalizedRecommendations(userId, limit = 10) {
        const userInteractions = await this.interactionRepository.find({
            where: { userId },
            relations: ['event'],
            order: { createdAt: 'DESC' },
            take: 100
        });
        const userPreferences = this.analyzeUserPreferences(userInteractions);
        const queryBuilder = this.eventRepository.createQueryBuilder('event')
            .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
            .andWhere('event.visibility IN (:...visibility)', { visibility: ['public', 'unlisted'] })
            .andWhere('event.startDate > :now', { now: new Date() })
            .andWhere('event.creatorId != :userId', { userId });
        if (userPreferences.categories.length > 0) {
            queryBuilder.andWhere('event.categories && :categories', { categories: userPreferences.categories });
        }
        if (userPreferences.tags.length > 0) {
            queryBuilder.andWhere('event.tags && :tags', { tags: userPreferences.tags });
        }
        if (userPreferences.industries.length > 0) {
            queryBuilder.andWhere('event.industry IN (:...industries)', { industries: userPreferences.industries });
        }
        const interactedEventIds = userInteractions.map(i => i.eventId);
        if (interactedEventIds.length > 0) {
            queryBuilder.andWhere('event.id NOT IN (:...excludeIds)', { excludeIds: interactedEventIds });
        }
        queryBuilder
            .orderBy('event.engagementScore', 'DESC')
            .addOrderBy('event.viewCount', 'DESC')
            .addOrderBy('event.totalRegistered', 'DESC')
            .limit(limit);
        return queryBuilder.getMany();
    }
    async getLocationBasedRecommendations(latitude, longitude, radiusKm = 50, limit = 10) {
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
    async exploreEvents(userId, exploreDto) {
        const queryBuilder = this.eventRepository.createQueryBuilder('event')
            .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
            .andWhere('event.visibility = :visibility', { visibility: 'public' })
            .andWhere('event.startDate > :now', { now: new Date() });
        if (exploreDto.filters) {
            await this.applyFilters(queryBuilder, exploreDto.filters);
        }
        this.applySorting(queryBuilder, exploreDto.sortBy || 'relevance', exploreDto.sortOrder || 'DESC');
        const page = exploreDto.page || 1;
        const limit = exploreDto.limit || 20;
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [events, total] = await queryBuilder.getManyAndCount();
        if (userId) {
            this.trackBulkInteraction(userId, events.map(e => e.id), user_event_interaction_entity_1.InteractionType.VIEW);
        }
        return { events, total };
    }
    async getTrendingEvents(limit = 10) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return this.eventRepository.createQueryBuilder('event')
            .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
            .andWhere('event.visibility = :visibility', { visibility: 'public' })
            .andWhere('event.startDate > :now', { now: new Date() })
            .andWhere('event.updatedAt > :sevenDaysAgo', { sevenDaysAgo })
            .orderBy('event.engagementScore', 'DESC')
            .addOrderBy('event.totalRegistered', 'DESC')
            .addOrderBy('event.viewCount', 'DESC')
            .limit(limit)
            .getMany();
    }
    async getUpcomingEvents(limit = 10) {
        return this.eventRepository.createQueryBuilder('event')
            .where('event.status IN (:...statuses)', { statuses: ['published', 'live'] })
            .andWhere('event.visibility = :visibility', { visibility: 'public' })
            .andWhere('event.startDate > :now', { now: new Date() })
            .orderBy('event.startDate', 'ASC')
            .limit(limit)
            .getMany();
    }
    async trackInteraction(userId, eventId, type, metadata) {
        try {
            const interaction = this.interactionRepository.create({
                userId,
                eventId,
                type,
                metadata
            });
            await this.interactionRepository.save(interaction);
            await this.updateEventEngagement(eventId, type);
        }
        catch (error) {
            console.log('Interaction already exists or error:', error.message);
        }
    }
    async subscribeToEvent(userId, eventId) {
        const subscription = this.subscriptionRepository.create({
            userId,
            eventId
        });
        await this.trackInteraction(userId, eventId, user_event_interaction_entity_1.InteractionType.BOOKMARK);
        return this.subscriptionRepository.save(subscription);
    }
    async unsubscribeFromEvent(userId, eventId) {
        await this.subscriptionRepository.delete({ userId, eventId });
    }
    analyzeUserPreferences(interactions) {
        const preferences = {
            categories: [],
            tags: [],
            industries: [],
            experienceLevels: []
        };
        const categoryCount = {};
        const tagCount = {};
        const industryCount = {};
        const experienceCount = {};
        interactions.forEach(interaction => {
            const event = interaction.event;
            if (!event)
                return;
            const weight = this.getInteractionWeight(interaction.type);
            if (event.categories) {
                event.categories.forEach(category => {
                    categoryCount[category] = (categoryCount[category] || 0) + weight;
                });
            }
            if (event.tags) {
                event.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + weight;
                });
            }
            if (event.industry) {
                industryCount[event.industry] = (industryCount[event.industry] || 0) + weight;
            }
            if (event.experienceLevel) {
                experienceCount[event.experienceLevel] = (experienceCount[event.experienceLevel] || 0) + weight;
            }
        });
        preferences.categories = this.getTopItems(categoryCount, 5);
        preferences.tags = this.getTopItems(tagCount, 10);
        preferences.industries = this.getTopItems(industryCount, 3);
        preferences.experienceLevels = this.getTopItems(experienceCount, 2);
        return preferences;
    }
    getInteractionWeight(type) {
        const weights = {
            [user_event_interaction_entity_1.InteractionType.VIEW]: 1,
            [user_event_interaction_entity_1.InteractionType.LIKE]: 3,
            [user_event_interaction_entity_1.InteractionType.BOOKMARK]: 5,
            [user_event_interaction_entity_1.InteractionType.SHARE]: 4,
            [user_event_interaction_entity_1.InteractionType.REGISTER]: 10,
            [user_event_interaction_entity_1.InteractionType.ATTEND]: 15
        };
        return weights[type] || 1;
    }
    getTopItems(countMap, limit) {
        return Object.entries(countMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([item]) => item);
    }
    async applyFilters(queryBuilder, filters) {
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
        if (filters.location) {
            const { latitude, longitude, radius } = filters.location;
            queryBuilder.andWhere(`
        (6371 * acos(cos(radians(:latitude)) * cos(radians(event.latitude)) * 
        cos(radians(event.longitude) - radians(:longitude)) + sin(radians(:latitude)) * 
        sin(radians(event.latitude)))) < :radius
      `, { latitude, longitude, radius });
        }
    }
    applySorting(queryBuilder, sortBy, sortOrder) {
        switch (sortBy) {
            case 'date':
                queryBuilder.orderBy('event.startDate', sortOrder);
                break;
            case 'popularity':
                queryBuilder.orderBy('event.totalRegistered', sortOrder);
                break;
            case 'engagement':
                queryBuilder.orderBy('event.engagementScore', sortOrder);
                break;
            case 'views':
                queryBuilder.orderBy('event.viewCount', sortOrder);
                break;
            case 'distance':
                queryBuilder.orderBy('event.startDate', 'ASC');
                break;
            default:
                queryBuilder
                    .orderBy('event.engagementScore', 'DESC')
                    .addOrderBy('event.totalRegistered', 'DESC')
                    .addOrderBy('event.viewCount', 'DESC');
        }
    }
    async trackBulkInteraction(userId, eventIds, type) {
        const interactions = eventIds.map(eventId => ({
            userId,
            eventId,
            type
        }));
        try {
            await this.interactionRepository.save(interactions);
        }
        catch (error) {
            console.log('Bulk interaction tracking error:', error.message);
        }
    }
    async updateEventEngagement(eventId, interactionType) {
        const weight = this.getInteractionWeight(interactionType);
        switch (interactionType) {
            case user_event_interaction_entity_1.InteractionType.LIKE:
                await this.eventRepository.increment({ id: eventId }, 'likeCount', 1);
                break;
            case user_event_interaction_entity_1.InteractionType.BOOKMARK:
                await this.eventRepository.increment({ id: eventId }, 'bookmarkCount', 1);
                break;
        }
        await this.eventRepository.increment({ id: eventId }, 'engagementScore', weight);
    }
};
exports.EventRecommendationService = EventRecommendationService;
exports.EventRecommendationService = EventRecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(user_event_interaction_entity_1.UserEventInteraction)),
    __param(2, (0, typeorm_1.InjectRepository)(user_event_interaction_entity_1.UserEventSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventRecommendationService);
//# sourceMappingURL=event-recommendation.service.js.map