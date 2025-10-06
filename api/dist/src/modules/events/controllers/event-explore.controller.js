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
exports.RecurringEventController = exports.EventExploreController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const event_recommendation_service_1 = require("../services/event-recommendation.service");
const recurring_event_service_1 = require("../services/recurring-event.service");
let EventExploreController = class EventExploreController {
    recommendationService;
    recurringEventService;
    constructor(recommendationService, recurringEventService) {
        this.recommendationService = recommendationService;
        this.recurringEventService = recurringEventService;
    }
    async exploreEvents(req, exploreDto) {
        const userId = req.user?.userId || null;
        const result = await this.recommendationService.exploreEvents(userId, exploreDto);
        return {
            message: 'Events retrieved successfully',
            events: result.events,
            total: result.total,
            page: exploreDto.page || 1,
            limit: exploreDto.limit || 20,
            totalPages: Math.ceil(result.total / (exploreDto.limit || 20))
        };
    }
    async getPersonalizedRecommendations(req, limit) {
        const events = await this.recommendationService.getPersonalizedRecommendations(req.user.userId, limit);
        return {
            message: 'Personalized recommendations retrieved successfully',
            events,
            total: events.length
        };
    }
    async getNearbyEvents(latitude, longitude, radius, limit) {
        const events = await this.recommendationService.getLocationBasedRecommendations(latitude, longitude, radius, limit);
        return {
            message: 'Nearby events retrieved successfully',
            events,
            total: events.length
        };
    }
    async getTrendingEvents(limit) {
        const events = await this.recommendationService.getTrendingEvents(limit);
        return {
            message: 'Trending events retrieved successfully',
            events,
            total: events.length
        };
    }
    async getUpcomingEvents(limit) {
        const events = await this.recommendationService.getUpcomingEvents(limit);
        return {
            message: 'Upcoming events retrieved successfully',
            events,
            total: events.length
        };
    }
    async trackInteraction(req, eventId, body) {
        await this.recommendationService.trackInteraction(req.user.userId, eventId, body.type, body.metadata);
        return { message: 'Interaction tracked successfully' };
    }
    async subscribeToEvent(req, eventId) {
        const subscription = await this.recommendationService.subscribeToEvent(req.user.userId, eventId);
        return { message: 'Subscribed to event successfully', subscription };
    }
    async unsubscribeFromEvent(req, eventId) {
        await this.recommendationService.unsubscribeFromEvent(req.user.userId, eventId);
        return { message: 'Unsubscribed from event successfully' };
    }
};
exports.EventExploreController = EventExploreController;
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, event_recommendation_service_1.ExploreEventsDto]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "exploreEvents", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "getPersonalizedRecommendations", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "getNearbyEvents", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "getTrendingEvents", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "getUpcomingEvents", null);
__decorate([
    (0, common_1.Post)(':eventId/interact'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "trackInteraction", null);
__decorate([
    (0, common_1.Post)(':eventId/subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "subscribeToEvent", null);
__decorate([
    (0, common_1.Delete)(':eventId/subscribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventExploreController.prototype, "unsubscribeFromEvent", null);
exports.EventExploreController = EventExploreController = __decorate([
    (0, common_1.Controller)('explore/events'),
    __metadata("design:paramtypes", [event_recommendation_service_1.EventRecommendationService,
        recurring_event_service_1.RecurringEventService])
], EventExploreController);
let RecurringEventController = class RecurringEventController {
    recurringEventService;
    constructor(recurringEventService) {
        this.recurringEventService = recurringEventService;
    }
    async createRecurringEvent(req, eventId, recurringDto) {
        const events = await this.recurringEventService.createRecurringEvent(req.user.userId, eventId, recurringDto);
        return {
            message: 'Recurring event series created successfully',
            parentEvent: events[0],
            instances: events.slice(1),
            totalInstances: events.length - 1
        };
    }
    async getRecurringInstances(req, eventId) {
        const instances = await this.recurringEventService.getRecurringEventInstances(req.user.userId, eventId);
        return {
            message: 'Recurring event instances retrieved successfully',
            instances,
            total: instances.length
        };
    }
    async updateRecurringSeries(req, eventId, updateData) {
        const events = await this.recurringEventService.updateRecurringEventSeries(req.user.userId, eventId, updateData);
        return {
            message: 'Recurring event series updated successfully',
            parentEvent: events[0],
            instances: events.slice(1)
        };
    }
    async deleteRecurringSeries(req, eventId, deleteOption = 'future') {
        await this.recurringEventService.deleteRecurringEventSeries(req.user.userId, eventId, deleteOption);
        return { message: `Recurring event series (${deleteOption}) deleted successfully` };
    }
    async breakRecurringInstance(req, instanceId) {
        const event = await this.recurringEventService.breakRecurringEventInstance(req.user.userId, instanceId);
        return { message: 'Event instance broken from recurring series successfully', event };
    }
};
exports.RecurringEventController = RecurringEventController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, recurring_event_service_1.CreateRecurringEventDto]),
    __metadata("design:returntype", Promise)
], RecurringEventController.prototype, "createRecurringEvent", null);
__decorate([
    (0, common_1.Get)('instances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecurringEventController.prototype, "getRecurringInstances", null);
__decorate([
    (0, common_1.Put)('series'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RecurringEventController.prototype, "updateRecurringSeries", null);
__decorate([
    (0, common_1.Delete)('series'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Query)('option')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], RecurringEventController.prototype, "deleteRecurringSeries", null);
__decorate([
    (0, common_1.Post)('instances/:instanceId/break'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('instanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecurringEventController.prototype, "breakRecurringInstance", null);
exports.RecurringEventController = RecurringEventController = __decorate([
    (0, common_1.Controller)('events/:eventId/recurring'),
    __metadata("design:paramtypes", [recurring_event_service_1.RecurringEventService])
], RecurringEventController);
//# sourceMappingURL=event-explore.controller.js.map