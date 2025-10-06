import { GuestService } from '../services/guest.service';
import { InviteGuestDto, BulkInviteGuestsDto, ImportGuestsDto, UpdateGuestStatusDto, CheckInGuestDto, RegisterGuestDto, SearchGuestsDto } from '../dto/guest.dto';
export declare class GuestController {
    private readonly guestService;
    constructor(guestService: GuestService);
    inviteGuest(req: any, eventId: string, inviteDto: InviteGuestDto): Promise<{
        message: string;
        guest: import("../entities/event-guest.entity").EventGuest;
    }>;
    bulkInviteGuests(req: any, eventId: string, bulkInviteDto: BulkInviteGuestsDto): Promise<{
        message: string;
        invited: number;
        errors: number;
        details: {
            invited: import("../entities/event-guest.entity").EventGuest[];
            errors: any[];
        };
    }>;
    importGuests(req: any, eventId: string, importDto: ImportGuestsDto): Promise<{
        message: string;
        invited: number;
        errors: number;
        details: {
            invited: import("../entities/event-guest.entity").EventGuest[];
            errors: any[];
        };
    }>;
    findAll(req: any, eventId: string, searchDto: SearchGuestsDto): Promise<{
        message: string;
        guests: import("../entities/event-guest.entity").EventGuest[];
        total: number;
    }>;
    updateStatus(req: any, eventId: string, guestId: string, updateStatusDto: UpdateGuestStatusDto): Promise<{
        message: string;
        guest: import("../entities/event-guest.entity").EventGuest;
    }>;
    checkIn(req: any, eventId: string, guestId: string, checkInDto: CheckInGuestDto): Promise<{
        message: string;
        guest: import("../entities/event-guest.entity").EventGuest;
    }>;
    searchForCheckIn(req: any, eventId: string, search: string): Promise<{
        message: string;
        guests: import("../entities/event-guest.entity").EventGuest[];
        total: number;
    }>;
    confirmGuest(req: any, eventId: string, guestId: string): Promise<{
        message: string;
        guest: import("../entities/event-guest.entity").EventGuest;
    }>;
    bulkConfirmGuests(req: any, eventId: string, guestIds: string[]): Promise<{
        message: string;
        confirmed: number;
        errors: number;
        details: {
            confirmed: number;
            errors: any[];
        };
    }>;
    exportGuestList(req: any, eventId: string, format?: 'csv' | 'xlsx'): Promise<{
        message: string;
        data: any[];
        total: number;
        format: "csv" | "xlsx";
    }>;
    remove(req: any, eventId: string, guestId: string): Promise<{
        message: string;
    }>;
}
export declare class GuestRegistrationController {
    private readonly guestService;
    constructor(guestService: GuestService);
    getRegistrationForm(token: string): Promise<{
        message: string;
        guest: {
            id: string;
            guestName: string | null;
            guestEmail: string | null;
            status: import("../entities/event-guest.entity").GuestStatus;
        };
        event: {
            id: any;
            title: any;
            startDate: any;
            endDate: any;
            locationType: any;
            venueName: any;
            venueAddress: any;
            virtualLink: any;
            registrationQuestions: any;
        };
    }>;
    register(token: string, registerDto: RegisterGuestDto): Promise<{
        message: string;
        guest: import("../entities/event-guest.entity").EventGuest;
    }>;
}
