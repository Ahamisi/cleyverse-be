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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
const event_host_entity_1 = require("../entities/event-host.entity");
let EventService = class EventService {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async createEvent(userId, createEventDto) {
        const existingEvent = await this.eventRepository.findOne({
            where: { slug: createEventDto.slug }
        });
        if (existingEvent) {
            throw new common_1.ConflictException('Event slug already exists');
        }
        const startDate = new Date(createEventDto.startDate);
        const endDate = new Date(createEventDto.endDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        if (startDate < new Date()) {
            throw new common_1.BadRequestException('Start date cannot be in the past');
        }
        if (createEventDto.registrationStart && createEventDto.registrationEnd) {
            const regStart = new Date(createEventDto.registrationStart);
            const regEnd = new Date(createEventDto.registrationEnd);
            if (regStart >= regEnd) {
                throw new common_1.BadRequestException('Registration end date must be after start date');
            }
            if (regEnd > startDate) {
                throw new common_1.BadRequestException('Registration must end before event starts');
            }
        }
        const event = this.eventRepository.create({
            ...createEventDto,
            creatorId: userId,
            startDate,
            endDate,
            registrationStart: createEventDto.registrationStart ? new Date(createEventDto.registrationStart) : null,
            registrationEnd: createEventDto.registrationEnd ? new Date(createEventDto.registrationEnd) : null,
            vendorApplicationDeadline: createEventDto.vendorApplicationDeadline ? new Date(createEventDto.vendorApplicationDeadline) : null,
        });
        const savedEvent = await this.eventRepository.save(event);
        await this.createOwnerHost(userId, savedEvent.id);
        return savedEvent;
    }
    async createOwnerHost(userId, eventId) {
        const hostRepository = this.eventRepository.manager.getRepository(event_host_entity_1.EventHost);
        const ownerHost = hostRepository.create({
            eventId,
            userId,
            role: event_host_entity_1.HostRole.OWNER,
            permissions: [
                event_host_entity_1.HostPermissions.MANAGE_EVENT,
                event_host_entity_1.HostPermissions.MANAGE_GUESTS,
                event_host_entity_1.HostPermissions.MANAGE_VENDORS,
                event_host_entity_1.HostPermissions.MANAGE_HOSTS,
                event_host_entity_1.HostPermissions.CHECK_IN_GUESTS,
                event_host_entity_1.HostPermissions.SEND_MESSAGES,
                event_host_entity_1.HostPermissions.VIEW_ANALYTICS
            ],
            isActive: true,
            isFeatured: true,
            displayOrder: 0
        });
        await hostRepository.save(ownerHost);
    }
    async getUserEvents(userId, includeArchived = false) {
        const whereClause = { creatorId: userId };
        if (!includeArchived) {
            whereClause.status = (0, typeorm_2.In)([event_entity_1.EventStatus.DRAFT, event_entity_1.EventStatus.PUBLISHED, event_entity_1.EventStatus.LIVE, event_entity_1.EventStatus.COMPLETED]);
        }
        return this.eventRepository.find({
            where: whereClause,
            order: { createdAt: 'DESC' },
            relations: ['guests', 'hosts', 'vendors']
        });
    }
    async getEventById(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId },
            relations: ['guests', 'hosts', 'vendors', 'products', 'registrationQuestions']
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return event;
    }
    async getPublicEvent(slug) {
        const event = await this.eventRepository.findOne({
            where: {
                slug,
                status: (0, typeorm_2.In)([event_entity_1.EventStatus.PUBLISHED, event_entity_1.EventStatus.LIVE]),
                visibility: (0, typeorm_2.In)([event_entity_1.EventVisibility.PUBLIC, event_entity_1.EventVisibility.UNLISTED])
            },
            relations: ['hosts', 'vendors', 'registrationQuestions']
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or not available');
        }
        await this.eventRepository.increment({ id: event.id }, 'viewCount', 1);
        return event;
    }
    async updateEvent(userId, eventId, updateEventDto) {
        const event = await this.getEventById(userId, eventId);
        if (event.status === event_entity_1.EventStatus.LIVE || event.status === event_entity_1.EventStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot update live or completed events');
        }
        if (updateEventDto.startDate || updateEventDto.endDate) {
            const startDate = updateEventDto.startDate ? new Date(updateEventDto.startDate) : event.startDate;
            const endDate = updateEventDto.endDate ? new Date(updateEventDto.endDate) : event.endDate;
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('End date must be after start date');
            }
            if (startDate < new Date() && event.status === event_entity_1.EventStatus.DRAFT) {
                throw new common_1.BadRequestException('Start date cannot be in the past');
            }
        }
        if (updateEventDto.slug && updateEventDto.slug !== event.slug) {
            const existingEvent = await this.eventRepository.findOne({
                where: { slug: updateEventDto.slug }
            });
            if (existingEvent) {
                throw new common_1.ConflictException('Event slug already exists');
            }
        }
        const updateData = {
            ...updateEventDto,
            startDate: updateEventDto.startDate ? new Date(updateEventDto.startDate) : undefined,
            endDate: updateEventDto.endDate ? new Date(updateEventDto.endDate) : undefined,
            registrationStart: updateEventDto.registrationStart ? new Date(updateEventDto.registrationStart) : undefined,
            registrationEnd: updateEventDto.registrationEnd ? new Date(updateEventDto.registrationEnd) : undefined,
            vendorApplicationDeadline: updateEventDto.vendorApplicationDeadline ? new Date(updateEventDto.vendorApplicationDeadline) : undefined,
        };
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        await this.eventRepository.update(eventId, updateData);
        return this.getEventById(userId, eventId);
    }
    async updateEventStatus(userId, eventId, updateStatusDto) {
        const event = await this.getEventById(userId, eventId);
        const validTransitions = {
            [event_entity_1.EventStatus.DRAFT]: [event_entity_1.EventStatus.PUBLISHED, event_entity_1.EventStatus.CANCELLED],
            [event_entity_1.EventStatus.PUBLISHED]: [event_entity_1.EventStatus.LIVE, event_entity_1.EventStatus.CANCELLED, event_entity_1.EventStatus.DRAFT],
            [event_entity_1.EventStatus.LIVE]: [event_entity_1.EventStatus.COMPLETED, event_entity_1.EventStatus.CANCELLED],
            [event_entity_1.EventStatus.COMPLETED]: [event_entity_1.EventStatus.ARCHIVED],
            [event_entity_1.EventStatus.CANCELLED]: [event_entity_1.EventStatus.DRAFT, event_entity_1.EventStatus.ARCHIVED],
            [event_entity_1.EventStatus.ARCHIVED]: []
        };
        if (!validTransitions[event.status].includes(updateStatusDto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${event.status} to ${updateStatusDto.status}`);
        }
        const updateData = { status: updateStatusDto.status };
        switch (updateStatusDto.status) {
            case event_entity_1.EventStatus.PUBLISHED:
                updateData.publishedAt = new Date();
                break;
            case event_entity_1.EventStatus.CANCELLED:
                updateData.cancelledAt = new Date();
                updateData.cancellationReason = updateStatusDto.reason;
                break;
        }
        await this.eventRepository.update(eventId, updateData);
        return this.getEventById(userId, eventId);
    }
    async deleteEvent(userId, eventId) {
        const event = await this.getEventById(userId, eventId);
        if (![event_entity_1.EventStatus.DRAFT, event_entity_1.EventStatus.CANCELLED].includes(event.status)) {
            throw new common_1.BadRequestException('Can only delete draft or cancelled events');
        }
        if (event.totalRegistered > 0) {
            throw new common_1.BadRequestException('Cannot delete event with registered guests. Cancel it instead.');
        }
        await this.eventRepository.remove(event);
    }
    async duplicateEvent(userId, eventId) {
        const originalEvent = await this.getEventById(userId, eventId);
        const eventData = { ...originalEvent };
        eventData.id = undefined;
        eventData.createdAt = undefined;
        eventData.updatedAt = undefined;
        eventData.guests = undefined;
        eventData.hosts = undefined;
        eventData.vendors = undefined;
        eventData.products = undefined;
        eventData.registrationQuestions = undefined;
        eventData.status = event_entity_1.EventStatus.DRAFT;
        eventData.viewCount = 0;
        eventData.shareCount = 0;
        eventData.totalRegistered = 0;
        eventData.totalAttended = 0;
        eventData.publishedAt = null;
        eventData.cancelledAt = null;
        eventData.cancellationReason = null;
        eventData.slug = `${originalEvent.slug}-copy-${Date.now()}`;
        eventData.title = `${originalEvent.title} (Copy)`;
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const duration = originalEvent.endDate.getTime() - originalEvent.startDate.getTime();
        eventData.startDate = oneWeekFromNow;
        eventData.endDate = new Date(oneWeekFromNow.getTime() + duration);
        const newEvent = this.eventRepository.create(eventData);
        return this.eventRepository.save(newEvent);
    }
    async searchEvents(searchDto) {
        const queryBuilder = this.eventRepository.createQueryBuilder('event')
            .leftJoinAndSelect('event.hosts', 'hosts')
            .where('event.visibility = :visibility', { visibility: event_entity_1.EventVisibility.PUBLIC })
            .andWhere('event.status IN (:...statuses)', { statuses: [event_entity_1.EventStatus.PUBLISHED, event_entity_1.EventStatus.LIVE] });
        if (searchDto.search) {
            queryBuilder.andWhere('(event.title ILIKE :search OR event.description ILIKE :search OR event.venueName ILIKE :search)', { search: `%${searchDto.search}%` });
        }
        if (searchDto.type) {
            queryBuilder.andWhere('event.type = :type', { type: searchDto.type });
        }
        if (searchDto.locationType) {
            queryBuilder.andWhere('event.locationType = :locationType', { locationType: searchDto.locationType });
        }
        if (searchDto.startDate) {
            queryBuilder.andWhere('event.startDate >= :startDate', { startDate: new Date(searchDto.startDate) });
        }
        if (searchDto.endDate) {
            queryBuilder.andWhere('event.endDate <= :endDate', { endDate: new Date(searchDto.endDate) });
        }
        if (searchDto.location) {
            queryBuilder.andWhere('(event.venueName ILIKE :location OR event.venueAddress ILIKE :location)', { location: `%${searchDto.location}%` });
        }
        if (searchDto.ticketType) {
            queryBuilder.andWhere('event.ticketType = :ticketType', { ticketType: searchDto.ticketType });
        }
        const sortBy = searchDto.sortBy || 'startDate';
        const sortOrder = searchDto.sortOrder || 'ASC';
        if (sortBy === 'relevance') {
            queryBuilder.orderBy('event.viewCount', sortOrder);
        }
        else {
            queryBuilder.orderBy(`event.${sortBy}`, sortOrder);
        }
        const page = searchDto.page || 1;
        const limit = searchDto.limit || 20;
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const [events, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            events,
            total,
            page,
            totalPages
        };
    }
    async getEventAnalytics(userId, eventId) {
        const event = await this.getEventById(userId, eventId);
        const guestStats = await this.eventRepository
            .createQueryBuilder('event')
            .leftJoin('event.guests', 'guest')
            .select([
            'COUNT(CASE WHEN guest.status = \'registered\' THEN 1 END) as registered',
            'COUNT(CASE WHEN guest.status = \'checked_in\' THEN 1 END) as checkedIn',
            'COUNT(CASE WHEN guest.status = \'waitlisted\' THEN 1 END) as waitlisted',
            'COUNT(CASE WHEN guest.status = \'cancelled\' THEN 1 END) as cancelled'
        ])
            .where('event.id = :eventId', { eventId })
            .getRawOne();
        const vendorStats = await this.eventRepository
            .createQueryBuilder('event')
            .leftJoin('event.vendors', 'vendor')
            .select([
            'COUNT(CASE WHEN vendor.status = \'approved\' THEN 1 END) as approvedVendors',
            'COUNT(CASE WHEN vendor.status = \'applied\' THEN 1 END) as pendingVendors',
            'SUM(vendor.totalSales) as totalVendorSales'
        ])
            .where('event.id = :eventId', { eventId })
            .getRawOne();
        return {
            event: {
                id: event.id,
                title: event.title,
                status: event.status,
                startDate: event.startDate,
                viewCount: event.viewCount,
                shareCount: event.shareCount
            },
            guests: {
                registered: parseInt(guestStats.registered) || 0,
                checkedIn: parseInt(guestStats.checkedIn) || 0,
                waitlisted: parseInt(guestStats.waitlisted) || 0,
                cancelled: parseInt(guestStats.cancelled) || 0,
                attendanceRate: guestStats.registered > 0 ?
                    ((parseInt(guestStats.checkedIn) || 0) / parseInt(guestStats.registered) * 100).toFixed(2) : '0.00'
            },
            vendors: {
                approved: parseInt(vendorStats.approvedVendors) || 0,
                pending: parseInt(vendorStats.pendingVendors) || 0,
                totalSales: parseFloat(vendorStats.totalVendorSales) || 0
            },
            capacity: {
                limit: event.capacity,
                available: event.capacity ? event.capacity - event.totalRegistered : null,
                utilizationRate: event.capacity ?
                    (event.totalRegistered / event.capacity * 100).toFixed(2) : null
            }
        };
    }
    async checkSlugAvailability(slug) {
        const event = await this.eventRepository.findOne({
            where: { slug }
        });
        return !event;
    }
    async generateSlug(title) {
        let baseSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .substring(0, 100);
        let slug = baseSlug;
        let counter = 1;
        while (!(await this.checkSlugAvailability(slug))) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return slug;
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EventService);
//# sourceMappingURL=event.service.js.map