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
exports.HostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_host_entity_1 = require("../entities/event-host.entity");
const event_entity_1 = require("../entities/event.entity");
const uuid_1 = require("uuid");
let HostService = class HostService {
    hostRepository;
    eventRepository;
    constructor(hostRepository, eventRepository) {
        this.hostRepository = hostRepository;
        this.eventRepository = eventRepository;
    }
    async addHost(userId, eventId, addHostDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const existingHost = await this.hostRepository.findOne({
            where: { eventId, user: { email: addHostDto.email } },
            relations: ['user']
        });
        if (existingHost) {
            throw new common_1.ConflictException('User is already a host for this event');
        }
        const host = this.hostRepository.create({
            eventId,
            userId: null,
            role: addHostDto.role,
            permissions: addHostDto.permissions,
            title: addHostDto.title,
            bio: addHostDto.bio,
            company: addHostDto.company,
            profileImageUrl: addHostDto.profileImageUrl,
            linkedinUrl: addHostDto.linkedinUrl,
            twitterUrl: addHostDto.twitterUrl,
            isFeatured: addHostDto.isFeatured || false,
            invitedBy: userId,
            invitedAt: new Date(),
            invitationToken: (0, uuid_1.v4)(),
            isActive: false
        });
        return this.hostRepository.save(host);
    }
    async getEventHosts(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        const isHost = await this.hostRepository.findOne({
            where: { eventId, userId, isActive: true }
        });
        if (!event && !isHost) {
            throw new common_1.NotFoundException('Event not found or access denied');
        }
        return this.hostRepository.find({
            where: { eventId },
            relations: ['user'],
            order: {
                isFeatured: 'DESC',
                displayOrder: 'ASC',
                createdAt: 'ASC'
            }
        });
    }
    async updateHost(userId, eventId, hostId, updateHostDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const host = await this.hostRepository.findOne({
            where: { id: hostId, eventId }
        });
        if (!host) {
            throw new common_1.NotFoundException('Host not found');
        }
        if (host.userId === userId && updateHostDto.role && updateHostDto.role !== event_host_entity_1.HostRole.OWNER) {
            throw new common_1.BadRequestException('Event owner cannot change their own role');
        }
        Object.assign(host, updateHostDto);
        return this.hostRepository.save(host);
    }
    async removeHost(userId, eventId, hostId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const host = await this.hostRepository.findOne({
            where: { id: hostId, eventId }
        });
        if (!host) {
            throw new common_1.NotFoundException('Host not found');
        }
        if (host.userId === userId && host.role === event_host_entity_1.HostRole.OWNER) {
            throw new common_1.BadRequestException('Event owner cannot remove themselves');
        }
        await this.hostRepository.remove(host);
    }
    async acceptHostInvitation(acceptDto) {
        const host = await this.hostRepository.findOne({
            where: { invitationToken: acceptDto.invitationToken },
            relations: ['event']
        });
        if (!host) {
            throw new common_1.NotFoundException('Invalid invitation token');
        }
        if (host.acceptedAt) {
            throw new common_1.BadRequestException('Invitation has already been accepted');
        }
        host.acceptedAt = new Date();
        host.isActive = true;
        host.invitationToken = null;
        if (acceptDto.title)
            host.title = acceptDto.title;
        if (acceptDto.bio)
            host.bio = acceptDto.bio;
        if (acceptDto.company)
            host.company = acceptDto.company;
        if (acceptDto.profileImageUrl)
            host.profileImageUrl = acceptDto.profileImageUrl;
        if (acceptDto.linkedinUrl)
            host.linkedinUrl = acceptDto.linkedinUrl;
        if (acceptDto.twitterUrl)
            host.twitterUrl = acceptDto.twitterUrl;
        return this.hostRepository.save(host);
    }
    async getHostInvitation(token) {
        const host = await this.hostRepository.findOne({
            where: { invitationToken: token },
            relations: ['event']
        });
        if (!host) {
            throw new common_1.NotFoundException('Invalid invitation token');
        }
        if (host.acceptedAt) {
            throw new common_1.BadRequestException('Invitation has already been accepted');
        }
        return host;
    }
    async generateHostLoginToken(userId, eventId, callbackUrl) {
        const host = await this.hostRepository.findOne({
            where: { eventId, userId, isActive: true }
        });
        if (!host) {
            throw new common_1.NotFoundException('You are not a host for this event');
        }
        const loginToken = (0, uuid_1.v4)();
        const baseUrl = callbackUrl || `https://app.cleyverse.com/events/${eventId}/host-dashboard`;
        const loginUrl = `${baseUrl}?token=${loginToken}`;
        return { token: loginToken, loginUrl };
    }
    async generateBulkHostLoginTokens(userId, eventId, callbackUrl) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or you are not the owner');
        }
        const hosts = await this.hostRepository.find({
            where: { eventId, isActive: true },
            relations: ['user']
        });
        const tokens = [];
        for (const host of hosts) {
            if (host.userId) {
                const loginToken = (0, uuid_1.v4)();
                const baseUrl = callbackUrl || `https://app.cleyverse.com/events/${eventId}/host-dashboard`;
                const loginUrl = `${baseUrl}?token=${loginToken}`;
                tokens.push({
                    hostId: host.id,
                    userId: host.userId,
                    email: host.user?.email,
                    name: host.user?.firstName + ' ' + host.user?.lastName,
                    role: host.role,
                    token: loginToken,
                    loginUrl
                });
            }
        }
        return { hosts, tokens };
    }
    async verifyHostAccess(userId, eventId, requiredPermission) {
        const host = await this.hostRepository.findOne({
            where: { eventId, userId, isActive: true }
        });
        if (!host) {
            return false;
        }
        if (host.role === event_host_entity_1.HostRole.OWNER) {
            return true;
        }
        return host.permissions.includes(requiredPermission);
    }
    async getPublicEventHosts(eventId) {
        return this.hostRepository.find({
            where: {
                eventId,
                isActive: true,
                isFeatured: true
            },
            relations: ['user'],
            order: {
                displayOrder: 'ASC',
                createdAt: 'ASC'
            }
        });
    }
};
exports.HostService = HostService;
exports.HostService = HostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_host_entity_1.EventHost)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HostService);
//# sourceMappingURL=host.service.js.map