import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventGuest, GuestStatus, GuestType, InvitationSource } from '../entities/event-guest.entity';
import { Event, EventStatus } from '../entities/event.entity';
import { InviteGuestDto, BulkInviteGuestsDto, ImportGuestsDto, UpdateGuestStatusDto, CheckInGuestDto, RegisterGuestDto, SearchGuestsDto } from '../dto/guest.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(EventGuest)
    private guestRepository: Repository<EventGuest>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async inviteGuest(userId: string, eventId: string, inviteDto: InviteGuestDto): Promise<EventGuest> {
    // Verify event belongs to user and is not completed/cancelled
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if ([EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.ARCHIVED].includes(event.status)) {
      throw new BadRequestException('Cannot invite guests to completed, cancelled, or archived events');
    }

    // Check if guest already exists
    let existingGuest: EventGuest | null = null;
    if (inviteDto.userId && inviteDto.userId !== 'user-id-if-registered-user') {
      existingGuest = await this.guestRepository.findOne({
        where: { eventId, userId: inviteDto.userId }
      });
    } else if (inviteDto.guestEmail) {
      existingGuest = await this.guestRepository.findOne({
        where: { eventId, guestEmail: inviteDto.guestEmail }
      });
    }

    if (existingGuest) {
      throw new ConflictException('Guest already invited to this event');
    }

    // Check capacity
    if (event.capacity && event.totalRegistered >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    const guest = this.guestRepository.create({
      eventId,
      userId: (inviteDto.userId && inviteDto.userId !== 'user-id-if-registered-user') ? inviteDto.userId : null,
      guestName: inviteDto.guestName,
      guestEmail: inviteDto.guestEmail,
      guestPhone: inviteDto.guestPhone,
      guestCompany: inviteDto.guestCompany,
      guestType: inviteDto.guestType || GuestType.STANDARD,
      invitationSource: inviteDto.invitationSource || InvitationSource.DIRECT,
      status: GuestStatus.INVITED,
      registrationToken: uuidv4(),
      invitationSentAt: new Date()
    });

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  async bulkInviteGuests(userId: string, eventId: string, bulkInviteDto: BulkInviteGuestsDto): Promise<{ invited: EventGuest[]; errors: any[] }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const invited: EventGuest[] = [];
    const errors: any[] = [];

    for (const guestDto of bulkInviteDto.guests) {
      try {
        const guest = await this.inviteGuest(userId, eventId, guestDto);
        invited.push(guest);
      } catch (error) {
        errors.push({
          guest: guestDto,
          error: error.message
        });
      }
    }

    return { invited, errors };
  }

  async importGuestsFromEmails(userId: string, eventId: string, importDto: ImportGuestsDto): Promise<{ invited: EventGuest[]; errors: any[] }> {
    const guestDtos = importDto.emails.map(email => ({
      guestEmail: email,
      guestType: importDto.guestType || GuestType.STANDARD,
      invitationSource: InvitationSource.IMPORT
    }));

    return this.bulkInviteGuests(userId, eventId, {
      guests: guestDtos,
      personalMessage: importDto.personalMessage,
      sendImmediately: true
    });
  }

  async registerGuest(registerDto: RegisterGuestDto): Promise<EventGuest> {
    const guest = await this.guestRepository.findOne({
      where: { registrationToken: registerDto.registrationToken },
      relations: ['event']
    });

    if (!guest) {
      throw new NotFoundException('Invalid registration token');
    }

    if (guest.status !== GuestStatus.INVITED) {
      throw new BadRequestException('Guest is already registered or cancelled');
    }

    // Check if event is still accepting registrations
    const event = guest.event;
    if (event.registrationEnd && new Date() > event.registrationEnd) {
      throw new BadRequestException('Registration period has ended');
    }

    if ([EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.ARCHIVED].includes(event.status)) {
      throw new BadRequestException('Event is no longer accepting registrations');
    }

    // Check capacity
    if (event.capacity && event.totalRegistered >= event.capacity) {
      if (event.allowWaitlist) {
        const waitlistPosition = await this.getNextWaitlistPosition(event.id);
        guest.status = GuestStatus.WAITLISTED;
        guest.waitlistPosition = waitlistPosition;
        guest.waitlistedAt = new Date();
      } else {
        throw new BadRequestException('Event is at full capacity and waitlist is not allowed');
      }
    } else {
      guest.status = event.requireApproval ? GuestStatus.REGISTERED : GuestStatus.CONFIRMED;
      guest.registeredAt = new Date();
      if (!event.requireApproval) {
        guest.confirmedAt = new Date();
      }

      // Update event total registered count
      await this.eventRepository.increment({ id: event.id }, 'totalRegistered', 1);
    }

    // Update guest information
    if (registerDto.guestName) guest.guestName = registerDto.guestName;
    if (registerDto.guestPhone) guest.guestPhone = registerDto.guestPhone;
    if (registerDto.guestCompany) guest.guestCompany = registerDto.guestCompany;
    if (registerDto.dietaryRestrictions) guest.dietaryRestrictions = registerDto.dietaryRestrictions;
    if (registerDto.specialRequests) guest.specialRequests = registerDto.specialRequests;
    if (registerDto.registrationAnswers) guest.registrationAnswers = registerDto.registrationAnswers;

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  async updateGuestStatus(userId: string, eventId: string, guestId: string, updateStatusDto: UpdateGuestStatusDto): Promise<EventGuest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId, eventId },
      relations: ['event']
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    // Verify event belongs to user
    if (guest.event.creatorId !== userId) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const oldStatus = guest.status;
    guest.status = updateStatusDto.status;

    // Handle status-specific logic
    switch (updateStatusDto.status) {
      case GuestStatus.CONFIRMED:
        if (oldStatus === GuestStatus.REGISTERED) {
          guest.confirmedAt = new Date();
        }
        break;
      case GuestStatus.CANCELLED:
        guest.cancelledAt = new Date();
        guest.cancellationReason = updateStatusDto.reason || null;
        
        // If was registered/confirmed, decrement count and potentially move waitlist
        if ([GuestStatus.REGISTERED, GuestStatus.CONFIRMED].includes(oldStatus)) {
          await this.eventRepository.decrement({ id: eventId }, 'totalRegistered', 1);
          await this.promoteFromWaitlist(eventId);
        }
        break;
    }

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  async checkInGuest(userId: string, eventId: string, guestId: string, checkInDto: CheckInGuestDto): Promise<EventGuest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId, eventId },
      relations: ['event']
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    // Verify event belongs to user
    if (guest.event.creatorId !== userId) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if (![GuestStatus.REGISTERED, GuestStatus.CONFIRMED].includes(guest.status)) {
      throw new BadRequestException('Guest must be registered or confirmed to check in');
    }

    guest.status = GuestStatus.CHECKED_IN;
    guest.checkedInAt = new Date();
    guest.checkedInBy = userId;
    guest.checkInMethod = checkInDto.checkInMethod || 'manual';

    // Update event attendance count
    await this.eventRepository.increment({ id: eventId }, 'totalAttended', 1);

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  async getEventGuests(userId: string, eventId: string, searchDto?: SearchGuestsDto): Promise<EventGuest[]> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const queryBuilder = this.guestRepository.createQueryBuilder('guest')
      .leftJoinAndSelect('guest.user', 'user')
      .where('guest.eventId = :eventId', { eventId });

    if (searchDto) {
      // Search filter
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(guest.guestName ILIKE :search OR guest.guestEmail ILIKE :search OR guest.guestCompany ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      // Status filter
      if (searchDto.status) {
        queryBuilder.andWhere('guest.status = :status', { status: searchDto.status });
      }

      // Guest type filter
      if (searchDto.guestType) {
        queryBuilder.andWhere('guest.guestType = :guestType', { guestType: searchDto.guestType });
      }

      // Invitation source filter
      if (searchDto.invitationSource) {
        queryBuilder.andWhere('guest.invitationSource = :invitationSource', { invitationSource: searchDto.invitationSource });
      }

      // Sorting
      const sortBy = searchDto.sortBy || 'createdAt';
      const sortOrder = searchDto.sortOrder || 'DESC';
      queryBuilder.orderBy(`guest.${sortBy}`, sortOrder);
    } else {
      queryBuilder.orderBy('guest.createdAt', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async getGuestByToken(token: string): Promise<EventGuest> {
    const guest = await this.guestRepository.findOne({
      where: { registrationToken: token },
      relations: ['event', 'event.registrationQuestions']
    });

    if (!guest) {
      throw new NotFoundException('Invalid registration token');
    }

    return guest;
  }

  async deleteGuest(userId: string, eventId: string, guestId: string): Promise<void> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId, eventId },
      relations: ['event']
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    // Verify event belongs to user
    if (guest.event.creatorId !== userId) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // If guest was registered/confirmed, decrement count
    if ([GuestStatus.REGISTERED, GuestStatus.CONFIRMED].includes(guest.status)) {
      await this.eventRepository.decrement({ id: eventId }, 'totalRegistered', 1);
      await this.promoteFromWaitlist(eventId);
    }

    await this.guestRepository.remove(guest);
  }

  async searchGuestsForCheckIn(userId: string, eventId: string, search: string): Promise<EventGuest[]> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return this.guestRepository
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.user', 'user')
      .where('guest.eventId = :eventId', { eventId })
      .andWhere('guest.status IN (:...statuses)', { statuses: [GuestStatus.REGISTERED, GuestStatus.CONFIRMED] })
      .andWhere(
        '(guest.guestName ILIKE :search OR guest.guestEmail ILIKE :search OR guest.guestCompany ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` }
      )
      .orderBy('guest.guestName', 'ASC')
      .limit(20)
      .getMany();
  }

  async confirmGuest(userId: string, eventId: string, guestId: string): Promise<EventGuest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId, eventId },
      relations: ['event']
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    // Verify event belongs to user
    if (guest.event.creatorId !== userId) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    if (guest.status !== GuestStatus.REGISTERED) {
      throw new BadRequestException('Guest must be registered to be confirmed');
    }

    guest.status = GuestStatus.CONFIRMED;
    guest.confirmedAt = new Date();

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  async bulkConfirmGuests(userId: string, eventId: string, guestIds: string[]): Promise<{ confirmed: number; errors: any[] }> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const confirmed: EventGuest[] = [];
    const errors: any[] = [];

    for (const guestId of guestIds) {
      try {
        const guest = await this.confirmGuest(userId, eventId, guestId);
        confirmed.push(guest);
      } catch (error) {
        errors.push({
          guestId,
          error: error.message
        });
      }
    }

    return { confirmed: confirmed.length, errors };
  }

  async exportGuestList(userId: string, eventId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<any[]> {
    const guests = await this.getEventGuests(userId, eventId);
    
    return guests.map(guest => ({
      name: guest.guestName || `${guest.user?.firstName || ''} ${guest.user?.lastName || ''}`.trim(),
      email: guest.guestEmail || guest.user?.email,
      phone: guest.guestPhone,
      company: guest.guestCompany,
      status: guest.status,
      guestType: guest.guestType,
      registeredAt: guest.registeredAt,
      checkedInAt: guest.checkedInAt,
      invitationSource: guest.invitationSource,
      dietaryRestrictions: guest.dietaryRestrictions,
      specialRequests: guest.specialRequests
    }));
  }

  private async getNextWaitlistPosition(eventId: string): Promise<number> {
    const lastWaitlistGuest = await this.guestRepository.findOne({
      where: { eventId, status: GuestStatus.WAITLISTED },
      order: { waitlistPosition: 'DESC' }
    });

    return (lastWaitlistGuest?.waitlistPosition || 0) + 1;
  }

  private async promoteFromWaitlist(eventId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event || !event.capacity) return;

    if (event.totalRegistered < event.capacity) {
      const nextWaitlistGuest = await this.guestRepository.findOne({
        where: { eventId, status: GuestStatus.WAITLISTED },
        order: { waitlistPosition: 'ASC' }
      });

      if (nextWaitlistGuest) {
        nextWaitlistGuest.status = event.requireApproval ? GuestStatus.REGISTERED : GuestStatus.CONFIRMED;
        nextWaitlistGuest.registeredAt = new Date();
        nextWaitlistGuest.waitlistPosition = null;
        nextWaitlistGuest.waitlistedAt = null;

        if (!event.requireApproval) {
          nextWaitlistGuest.confirmedAt = new Date();
        }

        await this.guestRepository.save(nextWaitlistGuest);
        await this.eventRepository.increment({ id: eventId }, 'totalRegistered', 1);
      }
    }
  }
}
