import { Repository } from 'typeorm';
import { EventHost, HostPermissions } from '../entities/event-host.entity';
import { Event } from '../entities/event.entity';
import { AddHostDto, UpdateHostDto, AcceptHostInvitationDto } from '../dto/host.dto';
export declare class HostService {
    private hostRepository;
    private eventRepository;
    constructor(hostRepository: Repository<EventHost>, eventRepository: Repository<Event>);
    addHost(userId: string, eventId: string, addHostDto: AddHostDto): Promise<EventHost>;
    getEventHosts(userId: string, eventId: string): Promise<EventHost[]>;
    updateHost(userId: string, eventId: string, hostId: string, updateHostDto: UpdateHostDto): Promise<EventHost>;
    removeHost(userId: string, eventId: string, hostId: string): Promise<void>;
    acceptHostInvitation(acceptDto: AcceptHostInvitationDto): Promise<EventHost>;
    getHostInvitation(token: string): Promise<EventHost>;
    generateHostLoginToken(userId: string, eventId: string, callbackUrl?: string): Promise<{
        token: string;
        loginUrl: string;
    }>;
    generateBulkHostLoginTokens(userId: string, eventId: string, callbackUrl?: string): Promise<{
        hosts: any[];
        tokens: any[];
    }>;
    verifyHostAccess(userId: string, eventId: string, requiredPermission: HostPermissions): Promise<boolean>;
    getPublicEventHosts(eventId: string): Promise<EventHost[]>;
}
