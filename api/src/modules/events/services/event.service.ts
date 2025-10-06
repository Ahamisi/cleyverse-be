import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Event, EventStatus, EventVisibility } from '../entities/event.entity';
import { EventHost, HostRole, HostPermissions } from '../entities/event-host.entity';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto, SearchEventsDto } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createEvent(userId: string, createEventDto: CreateEventDto): Promise<Event> {
    // Check if slug is unique
    const existingEvent = await this.eventRepository.findOne({
      where: { slug: createEventDto.slug }
    });

    if (existingEvent) {
      throw new ConflictException('Event slug already exists');
    }

    // Validate dates
    const startDate = new Date(createEventDto.startDate);
    const endDate = new Date(createEventDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Validate registration dates if provided
    if (createEventDto.registrationStart && createEventDto.registrationEnd) {
      const regStart = new Date(createEventDto.registrationStart);
      const regEnd = new Date(createEventDto.registrationEnd);

      if (regStart >= regEnd) {
        throw new BadRequestException('Registration end date must be after start date');
      }

      if (regEnd > startDate) {
        throw new BadRequestException('Registration must end before event starts');
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

    const savedEvent = await this.eventRepository.save(event) as unknown as Event;

    // Auto-create the event creator as the owner host
    await this.createOwnerHost(userId, savedEvent.id);

    return savedEvent;
  }

  private async createOwnerHost(userId: string, eventId: string): Promise<void> {
    const hostRepository = this.eventRepository.manager.getRepository(EventHost);

    const ownerHost = hostRepository.create({
      eventId,
      userId,
      role: HostRole.OWNER,
      permissions: [
        HostPermissions.MANAGE_EVENT,
        HostPermissions.MANAGE_GUESTS,
        HostPermissions.MANAGE_VENDORS,
        HostPermissions.MANAGE_HOSTS,
        HostPermissions.CHECK_IN_GUESTS,
        HostPermissions.SEND_MESSAGES,
        HostPermissions.VIEW_ANALYTICS
      ],
      isActive: true,
      isFeatured: true,
      displayOrder: 0
    });

    await hostRepository.save(ownerHost);
  }

  async getUserEvents(userId: string, includeArchived: boolean = false): Promise<Event[]> {
    const whereClause: any = { creatorId: userId };
    
    if (!includeArchived) {
      whereClause.status = In([EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.LIVE, EventStatus.COMPLETED]);
    }

    return this.eventRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
      relations: ['guests', 'hosts', 'vendors']
    });
  }

  async getEventById(userId: string, eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId },
      relations: ['guests', 'hosts', 'vendors', 'products', 'registrationQuestions']
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return event;
  }

  async getPublicEvent(slug: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { 
        slug,
        status: In([EventStatus.PUBLISHED, EventStatus.LIVE]),
        visibility: In([EventVisibility.PUBLIC, EventVisibility.UNLISTED])
      },
      relations: ['hosts', 'vendors', 'registrationQuestions']
    });

    if (!event) {
      throw new NotFoundException('Event not found or not available');
    }

    // Increment view count
    await this.eventRepository.increment({ id: event.id }, 'viewCount', 1);

    return event;
  }

  async updateEvent(userId: string, eventId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.getEventById(userId, eventId);

    // Prevent updates to live or completed events
    if (event.status === EventStatus.LIVE || event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('Cannot update live or completed events');
    }

    // Validate dates if provided
    if (updateEventDto.startDate || updateEventDto.endDate) {
      const startDate = updateEventDto.startDate ? new Date(updateEventDto.startDate) : event.startDate;
      const endDate = updateEventDto.endDate ? new Date(updateEventDto.endDate) : event.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }

      if (startDate < new Date() && event.status === EventStatus.DRAFT) {
        throw new BadRequestException('Start date cannot be in the past');
      }
    }

    // Update slug if provided and different
    if (updateEventDto.slug && updateEventDto.slug !== event.slug) {
      const existingEvent = await this.eventRepository.findOne({
        where: { slug: updateEventDto.slug }
      });

      if (existingEvent) {
        throw new ConflictException('Event slug already exists');
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

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await this.eventRepository.update(eventId, updateData);
    return this.getEventById(userId, eventId);
  }

  async updateEventStatus(userId: string, eventId: string, updateStatusDto: UpdateEventStatusDto): Promise<Event> {
    const event = await this.getEventById(userId, eventId);

    // Validate status transitions
    const validTransitions: Record<EventStatus, EventStatus[]> = {
      [EventStatus.DRAFT]: [EventStatus.PUBLISHED, EventStatus.CANCELLED],
      [EventStatus.PUBLISHED]: [EventStatus.LIVE, EventStatus.CANCELLED, EventStatus.DRAFT],
      [EventStatus.LIVE]: [EventStatus.COMPLETED, EventStatus.CANCELLED],
      [EventStatus.COMPLETED]: [EventStatus.ARCHIVED],
      [EventStatus.CANCELLED]: [EventStatus.DRAFT, EventStatus.ARCHIVED],
      [EventStatus.ARCHIVED]: []
    };

    if (!validTransitions[event.status].includes(updateStatusDto.status)) {
      throw new BadRequestException(`Cannot transition from ${event.status} to ${updateStatusDto.status}`);
    }

    const updateData: any = { status: updateStatusDto.status };

    // Set timestamps based on status
    switch (updateStatusDto.status) {
      case EventStatus.PUBLISHED:
        updateData.publishedAt = new Date();
        break;
      case EventStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        updateData.cancellationReason = updateStatusDto.reason;
        break;
    }

    await this.eventRepository.update(eventId, updateData);
    return this.getEventById(userId, eventId);
  }

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const event = await this.getEventById(userId, eventId);

    // Only allow deletion of draft or cancelled events
    if (![EventStatus.DRAFT, EventStatus.CANCELLED].includes(event.status)) {
      throw new BadRequestException('Can only delete draft or cancelled events');
    }

    // Check if event has registered guests
    if (event.totalRegistered > 0) {
      throw new BadRequestException('Cannot delete event with registered guests. Cancel it instead.');
    }

    await this.eventRepository.remove(event);
  }

  async duplicateEvent(userId: string, eventId: string): Promise<Event> {
    const originalEvent = await this.getEventById(userId, eventId);

    // Create new event data
    const eventData = { ...originalEvent } as any;
    eventData.id = undefined;
    eventData.createdAt = undefined;
    eventData.updatedAt = undefined;
    eventData.guests = undefined;
    eventData.hosts = undefined;
    eventData.vendors = undefined;
    eventData.products = undefined;
    eventData.registrationQuestions = undefined;

    // Reset analytics and status
    eventData.status = EventStatus.DRAFT;
    eventData.viewCount = 0;
    eventData.shareCount = 0;
    eventData.totalRegistered = 0;
    eventData.totalAttended = 0;
    eventData.publishedAt = null;
    eventData.cancelledAt = null;
    eventData.cancellationReason = null;

    // Generate new slug
    eventData.slug = `${originalEvent.slug}-copy-${Date.now()}`;
    eventData.title = `${originalEvent.title} (Copy)`;

    // Set future dates (1 week from now)
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const duration = originalEvent.endDate.getTime() - originalEvent.startDate.getTime();
    eventData.startDate = oneWeekFromNow;
    eventData.endDate = new Date(oneWeekFromNow.getTime() + duration);

    const newEvent = this.eventRepository.create(eventData);
    return this.eventRepository.save(newEvent) as unknown as Event;
  }

  async searchEvents(searchDto: SearchEventsDto): Promise<{ events: Event[]; total: number; page: number; totalPages: number }> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.hosts', 'hosts')
      .where('event.visibility = :visibility', { visibility: EventVisibility.PUBLIC })
      .andWhere('event.status IN (:...statuses)', { statuses: [EventStatus.PUBLISHED, EventStatus.LIVE] });

    // Search filter
    if (searchDto.search) {
      queryBuilder.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search OR event.venueName ILIKE :search)',
        { search: `%${searchDto.search}%` }
      );
    }

    // Type filter
    if (searchDto.type) {
      queryBuilder.andWhere('event.type = :type', { type: searchDto.type });
    }

    // Location type filter
    if (searchDto.locationType) {
      queryBuilder.andWhere('event.locationType = :locationType', { locationType: searchDto.locationType });
    }

    // Date range filter
    if (searchDto.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', { startDate: new Date(searchDto.startDate) });
    }

    if (searchDto.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', { endDate: new Date(searchDto.endDate) });
    }

    // Location filter
    if (searchDto.location) {
      queryBuilder.andWhere(
        '(event.venueName ILIKE :location OR event.venueAddress ILIKE :location)',
        { location: `%${searchDto.location}%` }
      );
    }

    // Ticket type filter
    if (searchDto.ticketType) {
      queryBuilder.andWhere('event.ticketType = :ticketType', { ticketType: searchDto.ticketType });
    }

    // Sorting
    const sortBy = searchDto.sortBy || 'startDate';
    const sortOrder = searchDto.sortOrder || 'ASC';
    
    if (sortBy === 'relevance') {
      queryBuilder.orderBy('event.viewCount', sortOrder);
    } else {
      queryBuilder.orderBy(`event.${sortBy}`, sortOrder);
    }

    // Pagination
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

  async getEventAnalytics(userId: string, eventId: string): Promise<any> {
    const event = await this.getEventById(userId, eventId);

    // Get guest statistics
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

    // Get vendor statistics
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

  async checkSlugAvailability(slug: string): Promise<boolean> {
    const event = await this.eventRepository.findOne({
      where: { slug }
    });
    return !event;
  }

  async generateSlug(title: string): Promise<string> {
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
}
