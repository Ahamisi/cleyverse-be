import { HostService } from '../services/host.service';
import { AddHostDto, UpdateHostDto, AcceptHostInvitationDto } from '../dto/host.dto';
export declare class HostController {
    private readonly hostService;
    constructor(hostService: HostService);
    addHost(req: any, eventId: string, addHostDto: AddHostDto): Promise<{
        message: string;
        host: import("../entities/event-host.entity").EventHost;
        invitationUrl: string;
    }>;
    findAll(req: any, eventId: string): Promise<{
        message: string;
        hosts: import("../entities/event-host.entity").EventHost[];
        total: number;
    }>;
    getPublicHosts(eventId: string): Promise<{
        message: string;
        hosts: import("../entities/event-host.entity").EventHost[];
        total: number;
    }>;
    updateHost(req: any, eventId: string, hostId: string, updateHostDto: UpdateHostDto): Promise<{
        message: string;
        host: import("../entities/event-host.entity").EventHost;
    }>;
    removeHost(req: any, eventId: string, hostId: string): Promise<{
        message: string;
    }>;
    generateLoginToken(req: any, eventId: string, body?: {
        callbackUrl?: string;
    }): Promise<{
        message: string;
        token: string;
        loginUrl: string;
        expiresIn: string;
    }>;
    generateBulkTokens(req: any, eventId: string, body?: {
        callbackUrl?: string;
    }): Promise<{
        message: string;
        hosts: number;
        tokens: any[];
        expiresIn: string;
    }>;
}
export declare class HostInvitationController {
    private readonly hostService;
    constructor(hostService: HostService);
    getInvitation(token: string): Promise<{
        message: string;
        invitation: {
            id: string;
            role: import("../entities/event-host.entity").HostRole;
            permissions: import("../entities/event-host.entity").HostPermissions[];
            event: {
                id: any;
                title: any;
                startDate: any;
                endDate: any;
            };
            invitedAt: Date | null;
        };
    }>;
    acceptInvitation(token: string, acceptDto: AcceptHostInvitationDto): Promise<{
        message: string;
        host: import("../entities/event-host.entity").EventHost;
    }>;
}
