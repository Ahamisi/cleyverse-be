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
exports.GuestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_guest_entity_1 = require("../entities/event-guest.entity");
const event_entity_1 = require("../entities/event.entity");
const uuid_1 = require("uuid");
let GuestService = class GuestService {
    guestRepository;
    eventRepository;
    constructor(guestRepository, eventRepository) {
        this.guestRepository = guestRepository;
        this.eventRepository = eventRepository;
    }
    async inviteGuest(userId, eventId, inviteDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if ([event_entity_1.EventStatus.COMPLETED, event_entity_1.EventStatus.CANCELLED, event_entity_1.EventStatus.ARCHIVED].includes(event.status)) {
            throw new common_1.BadRequestException('Cannot invite guests to completed, cancelled, or archived events');
        }
        let existingGuest = null;
        if (inviteDto.userId && inviteDto.userId !== 'user-id-if-registered-user') {
            existingGuest = await this.guestRepository.findOne({
                where: { eventId, userId: inviteDto.userId }
            });
        }
        else if (inviteDto.guestEmail) {
            existingGuest = await this.guestRepository.findOne({
                where: { eventId, guestEmail: inviteDto.guestEmail }
            });
        }
        if (existingGuest) {
            throw new common_1.ConflictException('Guest already invited to this event');
        }
        if (event.capacity && event.totalRegistered >= event.capacity) {
            throw new common_1.BadRequestException('Event is at full capacity');
        }
        const guest = this.guestRepository.create({
            eventId,
            userId: (inviteDto.userId && inviteDto.userId !== 'user-id-if-registered-user') ? inviteDto.userId : null,
            guestName: inviteDto.guestName,
            guestEmail: inviteDto.guestEmail,
            guestPhone: inviteDto.guestPhone,
            guestCompany: inviteDto.guestCompany,
            guestType: inviteDto.guestType || event_guest_entity_1.GuestType.STANDARD,
            invitationSource: inviteDto.invitationSource || event_guest_entity_1.InvitationSource.DIRECT,
            status: event_guest_entity_1.GuestStatus.INVITED,
            registrationToken: (0, uuid_1.v4)(),
            invitationSentAt: new Date()
        });
        return this.guestRepository.save(guest);
    }
    async bulkInviteGuests(userId, eventId, bulkInviteDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const invited = [];
        const errors = [];
        for (const guestDto of bulkInviteDto.guests) {
            try {
                const guest = await this.inviteGuest(userId, eventId, guestDto);
                invited.push(guest);
            }
            catch (error) {
                errors.push({
                    guest: guestDto,
                    error: error.message
                });
            }
        }
        return { invited, errors };
    }
    async importGuestsFromEmails(userId, eventId, importDto) {
        const guestDtos = importDto.emails.map(email => ({
            guestEmail: email,
            guestType: importDto.guestType || event_guest_entity_1.GuestType.STANDARD,
            invitationSource: event_guest_entity_1.InvitationSource.IMPORT
        }));
        return this.bulkInviteGuests(userId, eventId, {
            guests: guestDtos,
            personalMessage: importDto.personalMessage,
            sendImmediately: true
        });
    }
    async registerGuest(registerDto) {
        const guest = await this.guestRepository.findOne({
            where: { registrationToken: registerDto.registrationToken },
            relations: ['event']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Invalid registration token');
        }
        if (guest.status !== event_guest_entity_1.GuestStatus.INVITED) {
            throw new common_1.BadRequestException('Guest is already registered or cancelled');
        }
        const event = guest.event;
        if (event.registrationEnd && new Date() > event.registrationEnd) {
            throw new common_1.BadRequestException('Registration period has ended');
        }
        if ([event_entity_1.EventStatus.COMPLETED, event_entity_1.EventStatus.CANCELLED, event_entity_1.EventStatus.ARCHIVED].includes(event.status)) {
            throw new common_1.BadRequestException('Event is no longer accepting registrations');
        }
        if (event.capacity && event.totalRegistered >= event.capacity) {
            if (event.allowWaitlist) {
                const waitlistPosition = await this.getNextWaitlistPosition(event.id);
                guest.status = event_guest_entity_1.GuestStatus.WAITLISTED;
                guest.waitlistPosition = waitlistPosition;
                guest.waitlistedAt = new Date();
            }
            else {
                throw new common_1.BadRequestException('Event is at full capacity and waitlist is not allowed');
            }
        }
        else {
            guest.status = event.requireApproval ? event_guest_entity_1.GuestStatus.REGISTERED : event_guest_entity_1.GuestStatus.CONFIRMED;
            guest.registeredAt = new Date();
            if (!event.requireApproval) {
                guest.confirmedAt = new Date();
            }
            await this.eventRepository.increment({ id: event.id }, 'totalRegistered', 1);
        }
        if (registerDto.guestName)
            guest.guestName = registerDto.guestName;
        if (registerDto.guestPhone)
            guest.guestPhone = registerDto.guestPhone;
        if (registerDto.guestCompany)
            guest.guestCompany = registerDto.guestCompany;
        if (registerDto.dietaryRestrictions)
            guest.dietaryRestrictions = registerDto.dietaryRestrictions;
        if (registerDto.specialRequests)
            guest.specialRequests = registerDto.specialRequests;
        if (registerDto.registrationAnswers)
            guest.registrationAnswers = registerDto.registrationAnswers;
        return this.guestRepository.save(guest);
    }
    async updateGuestStatus(userId, eventId, guestId, updateStatusDto) {
        const guest = await this.guestRepository.findOne({
            where: { id: guestId, eventId },
            relations: ['event']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Guest not found');
        }
        if (guest.event.creatorId !== userId) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const oldStatus = guest.status;
        guest.status = updateStatusDto.status;
        switch (updateStatusDto.status) {
            case event_guest_entity_1.GuestStatus.CONFIRMED:
                if (oldStatus === event_guest_entity_1.GuestStatus.REGISTERED) {
                    guest.confirmedAt = new Date();
                }
                break;
            case event_guest_entity_1.GuestStatus.CANCELLED:
                guest.cancelledAt = new Date();
                guest.cancellationReason = updateStatusDto.reason || null;
                if ([event_guest_entity_1.GuestStatus.REGISTERED, event_guest_entity_1.GuestStatus.CONFIRMED].includes(oldStatus)) {
                    await this.eventRepository.decrement({ id: eventId }, 'totalRegistered', 1);
                    await this.promoteFromWaitlist(eventId);
                }
                break;
        }
        return this.guestRepository.save(guest);
    }
    async checkInGuest(userId, eventId, guestId, checkInDto) {
        const guest = await this.guestRepository.findOne({
            where: { id: guestId, eventId },
            relations: ['event']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Guest not found');
        }
        if (guest.event.creatorId !== userId) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (![event_guest_entity_1.GuestStatus.REGISTERED, event_guest_entity_1.GuestStatus.CONFIRMED].includes(guest.status)) {
            throw new common_1.BadRequestException('Guest must be registered or confirmed to check in');
        }
        guest.status = event_guest_entity_1.GuestStatus.CHECKED_IN;
        guest.checkedInAt = new Date();
        guest.checkedInBy = userId;
        guest.checkInMethod = checkInDto.checkInMethod || 'manual';
        await this.eventRepository.increment({ id: eventId }, 'totalAttended', 1);
        return this.guestRepository.save(guest);
    }
    async getEventGuests(userId, eventId, searchDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const queryBuilder = this.guestRepository.createQueryBuilder('guest')
            .leftJoinAndSelect('guest.user', 'user')
            .where('guest.eventId = :eventId', { eventId });
        if (searchDto) {
            if (searchDto.search) {
                queryBuilder.andWhere('(guest.guestName ILIKE :search OR guest.guestEmail ILIKE :search OR guest.guestCompany ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)', { search: `%${searchDto.search}%` });
            }
            if (searchDto.status) {
                queryBuilder.andWhere('guest.status = :status', { status: searchDto.status });
            }
            if (searchDto.guestType) {
                queryBuilder.andWhere('guest.guestType = :guestType', { guestType: searchDto.guestType });
            }
            if (searchDto.invitationSource) {
                queryBuilder.andWhere('guest.invitationSource = :invitationSource', { invitationSource: searchDto.invitationSource });
            }
            const sortBy = searchDto.sortBy || 'createdAt';
            const sortOrder = searchDto.sortOrder || 'DESC';
            queryBuilder.orderBy(`guest.${sortBy}`, sortOrder);
        }
        else {
            queryBuilder.orderBy('guest.createdAt', 'DESC');
        }
        return queryBuilder.getMany();
    }
    async getGuestByToken(token) {
        const guest = await this.guestRepository.findOne({
            where: { registrationToken: token },
            relations: ['event', 'event.registrationQuestions']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Invalid registration token');
        }
        return guest;
    }
    async deleteGuest(userId, eventId, guestId) {
        const guest = await this.guestRepository.findOne({
            where: { id: guestId, eventId },
            relations: ['event']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Guest not found');
        }
        if (guest.event.creatorId !== userId) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if ([event_guest_entity_1.GuestStatus.REGISTERED, event_guest_entity_1.GuestStatus.CONFIRMED].includes(guest.status)) {
            await this.eventRepository.decrement({ id: eventId }, 'totalRegistered', 1);
            await this.promoteFromWaitlist(eventId);
        }
        await this.guestRepository.remove(guest);
    }
    async searchGuestsForCheckIn(userId, eventId, search) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return this.guestRepository
            .createQueryBuilder('guest')
            .leftJoinAndSelect('guest.user', 'user')
            .where('guest.eventId = :eventId', { eventId })
            .andWhere('guest.status IN (:...statuses)', { statuses: [event_guest_entity_1.GuestStatus.REGISTERED, event_guest_entity_1.GuestStatus.CONFIRMED] })
            .andWhere('(guest.guestName ILIKE :search OR guest.guestEmail ILIKE :search OR guest.guestCompany ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)', { search: `%${search}%` })
            .orderBy('guest.guestName', 'ASC')
            .limit(20)
            .getMany();
    }
    async confirmGuest(userId, eventId, guestId) {
        const guest = await this.guestRepository.findOne({
            where: { id: guestId, eventId },
            relations: ['event']
        });
        if (!guest) {
            throw new common_1.NotFoundException('Guest not found');
        }
        if (guest.event.creatorId !== userId) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (guest.status !== event_guest_entity_1.GuestStatus.REGISTERED) {
            throw new common_1.BadRequestException('Guest must be registered to be confirmed');
        }
        guest.status = event_guest_entity_1.GuestStatus.CONFIRMED;
        guest.confirmedAt = new Date();
        return this.guestRepository.save(guest);
    }
    async bulkConfirmGuests(userId, eventId, guestIds) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const confirmed = [];
        const errors = [];
        for (const guestId of guestIds) {
            try {
                const guest = await this.confirmGuest(userId, eventId, guestId);
                confirmed.push(guest);
            }
            catch (error) {
                errors.push({
                    guestId,
                    error: error.message
                });
            }
        }
        return { confirmed: confirmed.length, errors };
    }
    async exportGuestList(userId, eventId, format = 'csv') {
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
    async getNextWaitlistPosition(eventId) {
        const lastWaitlistGuest = await this.guestRepository.findOne({
            where: { eventId, status: event_guest_entity_1.GuestStatus.WAITLISTED },
            order: { waitlistPosition: 'DESC' }
        });
        return (lastWaitlistGuest?.waitlistPosition || 0) + 1;
    }
    async promoteFromWaitlist(eventId) {
        const event = await this.eventRepository.findOne({ where: { id: eventId } });
        if (!event || !event.capacity)
            return;
        if (event.totalRegistered < event.capacity) {
            const nextWaitlistGuest = await this.guestRepository.findOne({
                where: { eventId, status: event_guest_entity_1.GuestStatus.WAITLISTED },
                order: { waitlistPosition: 'ASC' }
            });
            if (nextWaitlistGuest) {
                nextWaitlistGuest.status = event.requireApproval ? event_guest_entity_1.GuestStatus.REGISTERED : event_guest_entity_1.GuestStatus.CONFIRMED;
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
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_guest_entity_1.EventGuest)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GuestService);
//# sourceMappingURL=guest.service.js.map