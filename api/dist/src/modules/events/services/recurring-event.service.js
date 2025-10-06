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
exports.RecurringEventService = exports.CreateRecurringEventDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
class CreateRecurringEventDto {
    recurrencePattern;
    recurrenceInterval;
    recurrenceEndDate;
    maxInstances;
}
exports.CreateRecurringEventDto = CreateRecurringEventDto;
let RecurringEventService = class RecurringEventService {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async createRecurringEvent(userId, eventId, recurringDto) {
        const parentEvent = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!parentEvent) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (parentEvent.isRecurring) {
            throw new common_1.BadRequestException('Event is already set as recurring');
        }
        parentEvent.isRecurring = true;
        parentEvent.recurrencePattern = recurringDto.recurrencePattern;
        parentEvent.recurrenceInterval = recurringDto.recurrenceInterval;
        parentEvent.recurrenceEndDate = recurringDto.recurrenceEndDate || null;
        await this.eventRepository.save(parentEvent);
        const instances = this.generateRecurringInstances(parentEvent, recurringDto);
        const savedInstances = await this.eventRepository.save(instances);
        return [parentEvent, ...savedInstances];
    }
    async getRecurringEventInstances(userId, parentEventId) {
        const parentEvent = await this.eventRepository.findOne({
            where: { id: parentEventId, creatorId: userId }
        });
        if (!parentEvent) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (!parentEvent.isRecurring) {
            throw new common_1.BadRequestException('Event is not a recurring event');
        }
        return this.eventRepository.find({
            where: { parentEventId },
            order: { startDate: 'ASC' }
        });
    }
    async updateRecurringEventSeries(userId, parentEventId, updateData) {
        const parentEvent = await this.eventRepository.findOne({
            where: { id: parentEventId, creatorId: userId }
        });
        if (!parentEvent) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const instances = await this.eventRepository.find({
            where: { parentEventId }
        });
        Object.assign(parentEvent, updateData);
        await this.eventRepository.save(parentEvent);
        const now = new Date();
        const futureInstances = instances.filter(instance => instance.startDate > now);
        for (const instance of futureInstances) {
            const { startDate, endDate, ...restUpdateData } = updateData;
            Object.assign(instance, restUpdateData);
        }
        if (futureInstances.length > 0) {
            await this.eventRepository.save(futureInstances);
        }
        return [parentEvent, ...instances];
    }
    async deleteRecurringEventSeries(userId, parentEventId, deleteOption) {
        const parentEvent = await this.eventRepository.findOne({
            where: { id: parentEventId, creatorId: userId }
        });
        if (!parentEvent) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const instances = await this.eventRepository.find({
            where: { parentEventId }
        });
        if (deleteOption === 'all') {
            await this.eventRepository.remove([parentEvent, ...instances]);
        }
        else {
            const now = new Date();
            const futureInstances = instances.filter(instance => instance.startDate > now);
            if (futureInstances.length > 0) {
                await this.eventRepository.remove(futureInstances);
            }
            parentEvent.isRecurring = false;
            parentEvent.recurrencePattern = null;
            parentEvent.recurrenceInterval = null;
            parentEvent.recurrenceEndDate = null;
            await this.eventRepository.save(parentEvent);
        }
    }
    async breakRecurringEventInstance(userId, instanceEventId) {
        const instance = await this.eventRepository.findOne({
            where: { id: instanceEventId, creatorId: userId }
        });
        if (!instance) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (!instance.parentEventId) {
            throw new common_1.BadRequestException('Event is not part of a recurring series');
        }
        instance.parentEventId = null;
        instance.isRecurring = false;
        instance.recurrencePattern = null;
        instance.recurrenceInterval = null;
        instance.recurrenceEndDate = null;
        return this.eventRepository.save(instance);
    }
    generateRecurringInstances(parentEvent, recurringDto) {
        const instances = [];
        const maxInstances = recurringDto.maxInstances || 52;
        const endDate = recurringDto.recurrenceEndDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        let currentDate = new Date(parentEvent.startDate);
        let instanceCount = 0;
        while (instanceCount < maxInstances && currentDate <= endDate) {
            currentDate = this.getNextOccurrence(currentDate, recurringDto.recurrencePattern, recurringDto.recurrenceInterval);
            if (currentDate > endDate)
                break;
            const duration = parentEvent.endDate.getTime() - parentEvent.startDate.getTime();
            const instanceEndDate = new Date(currentDate.getTime() + duration);
            const instance = this.eventRepository.create({
                title: parentEvent.title,
                description: parentEvent.description,
                slug: `${parentEvent.slug}-${currentDate.toISOString().split('T')[0]}`,
                startDate: new Date(currentDate),
                endDate: instanceEndDate,
                locationType: parentEvent.locationType,
                venueName: parentEvent.venueName,
                venueAddress: parentEvent.venueAddress,
                latitude: parentEvent.latitude,
                longitude: parentEvent.longitude,
                virtualLink: parentEvent.virtualLink,
                meetingId: parentEvent.meetingId,
                meetingPassword: parentEvent.meetingPassword,
                type: parentEvent.type,
                visibility: parentEvent.visibility,
                status: parentEvent.status,
                capacity: parentEvent.capacity,
                requireApproval: parentEvent.requireApproval,
                allowWaitlist: parentEvent.allowWaitlist,
                tags: parentEvent.tags,
                categories: parentEvent.categories,
                targetAudience: parentEvent.targetAudience,
                experienceLevel: parentEvent.experienceLevel,
                industry: parentEvent.industry,
                creatorId: parentEvent.creatorId,
                parentEventId: parentEvent.id,
                isRecurring: false,
                recurrencePattern: null,
                recurrenceInterval: null,
                recurrenceEndDate: null,
                viewCount: 0,
                likeCount: 0,
                bookmarkCount: 0,
                engagementScore: 0
            });
            instances.push(instance);
            instanceCount++;
        }
        return instances;
    }
    getNextOccurrence(currentDate, pattern, interval) {
        const nextDate = new Date(currentDate);
        switch (pattern) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + interval);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + (7 * interval));
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + interval);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + interval);
                break;
        }
        return nextDate;
    }
};
exports.RecurringEventService = RecurringEventService;
exports.RecurringEventService = RecurringEventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RecurringEventService);
//# sourceMappingURL=recurring-event.service.js.map