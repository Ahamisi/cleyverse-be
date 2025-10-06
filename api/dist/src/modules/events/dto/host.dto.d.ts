import { HostRole, HostPermissions } from '../entities/event-host.entity';
export declare class AddHostDto {
    email: string;
    name?: string;
    role: HostRole;
    permissions: HostPermissions[];
    title?: string;
    bio?: string;
    company?: string;
    profileImageUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    isFeatured?: boolean;
    personalMessage?: string;
}
export declare class UpdateHostDto {
    role?: HostRole;
    permissions?: HostPermissions[];
    title?: string;
    bio?: string;
    company?: string;
    profileImageUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    isFeatured?: boolean;
    isActive?: boolean;
}
export declare class AcceptHostInvitationDto {
    invitationToken: string;
    title?: string;
    bio?: string;
    company?: string;
    profileImageUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
}
