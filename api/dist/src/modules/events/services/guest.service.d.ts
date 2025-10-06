import { Repository } from 'typeorm';
import { EventGuest } from '../entities/event-guest.entity';
import { Event } from '../entities/event.entity';
import { InviteGuestDto, BulkInviteGuestsDto, ImportGuestsDto, UpdateGuestStatusDto, CheckInGuestDto, RegisterGuestDto, SearchGuestsDto } from '../dto/guest.dto';
export declare class GuestService {
    private guestRepository;
    private eventRepository;
    constructor(guestRepository: Repository<EventGuest>, eventRepository: Repository<Event>);
    inviteGuest(userId: string, eventId: string, inviteDto: InviteGuestDto): Promise<EventGuest>;
    bulkInviteGuests(userId: string, eventId: string, bulkInviteDto: BulkInviteGuestsDto): Promise<{
        invited: EventGuest[];
        errors: any[];
    }>;
    importGuestsFromEmails(userId: string, eventId: string, importDto: ImportGuestsDto): Promise<{
        invited: EventGuest[];
        errors: any[];
    }>;
    registerGuest(registerDto: RegisterGuestDto): Promise<EventGuest>;
    updateGuestStatus(userId: string, eventId: string, guestId: string, updateStatusDto: UpdateGuestStatusDto): Promise<EventGuest>;
    checkInGuest(userId: string, eventId: string, guestId: string, checkInDto: CheckInGuestDto): Promise<EventGuest>;
    getEventGuests(userId: string, eventId: string, searchDto?: SearchGuestsDto): Promise<EventGuest[]>;
    getGuestByToken(token: string): Promise<EventGuest>;
    deleteGuest(userId: string, eventId: string, guestId: string): Promise<void>;
    searchGuestsForCheckIn(userId: string, eventId: string, search: string): Promise<EventGuest[]>;
    confirmGuest(userId: string, eventId: string, guestId: string): Promise<EventGuest>;
    bulkConfirmGuests(userId: string, eventId: string, guestIds: string[]): Promise<{
        confirmed: number;
        errors: any[];
    }>;
    exportGuestList(userId: string, eventId: string, format?: 'csv' | 'xlsx'): Promise<any[]>;
    private getNextWaitlistPosition;
    private promoteFromWaitlist;
}
