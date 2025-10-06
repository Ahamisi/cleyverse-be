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
exports.HostInvitationController = exports.HostController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const host_service_1 = require("../services/host.service");
const host_dto_1 = require("../dto/host.dto");
let HostController = class HostController {
    hostService;
    constructor(hostService) {
        this.hostService = hostService;
    }
    async addHost(req, eventId, addHostDto) {
        const host = await this.hostService.addHost(req.user.userId, eventId, addHostDto);
        return {
            message: 'Host invitation sent successfully',
            host,
            invitationUrl: `https://cley.live/host-invitation/${host.invitationToken}`
        };
    }
    async findAll(req, eventId) {
        const hosts = await this.hostService.getEventHosts(req.user.userId, eventId);
        return { message: 'Hosts retrieved successfully', hosts, total: hosts.length };
    }
    async getPublicHosts(eventId) {
        const hosts = await this.hostService.getPublicEventHosts(eventId);
        return { message: 'Public hosts retrieved successfully', hosts, total: hosts.length };
    }
    async updateHost(req, eventId, hostId, updateHostDto) {
        const host = await this.hostService.updateHost(req.user.userId, eventId, hostId, updateHostDto);
        return { message: 'Host updated successfully', host };
    }
    async removeHost(req, eventId, hostId) {
        await this.hostService.removeHost(req.user.userId, eventId, hostId);
        return { message: 'Host removed successfully' };
    }
    async generateLoginToken(req, eventId, body) {
        const result = await this.hostService.generateHostLoginToken(req.user.userId, eventId, body?.callbackUrl);
        return {
            message: 'Host login token generated successfully',
            token: result.token,
            loginUrl: result.loginUrl,
            expiresIn: '24 hours'
        };
    }
    async generateBulkTokens(req, eventId, body) {
        const result = await this.hostService.generateBulkHostLoginTokens(req.user.userId, eventId, body?.callbackUrl);
        return {
            message: 'Bulk host login tokens generated successfully',
            hosts: result.hosts.length,
            tokens: result.tokens,
            expiresIn: '24 hours'
        };
    }
};
exports.HostController = HostController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, host_dto_1.AddHostDto]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "addHost", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "getPublicHosts", null);
__decorate([
    (0, common_1.Put)(':hostId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('hostId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, host_dto_1.UpdateHostDto]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "updateHost", null);
__decorate([
    (0, common_1.Delete)(':hostId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Param)('hostId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "removeHost", null);
__decorate([
    (0, common_1.Post)('generate-login-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "generateLoginToken", null);
__decorate([
    (0, common_1.Post)('generate-bulk-tokens'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HostController.prototype, "generateBulkTokens", null);
exports.HostController = HostController = __decorate([
    (0, common_1.Controller)('events/:eventId/hosts'),
    __metadata("design:paramtypes", [host_service_1.HostService])
], HostController);
let HostInvitationController = class HostInvitationController {
    hostService;
    constructor(hostService) {
        this.hostService = hostService;
    }
    async getInvitation(token) {
        const host = await this.hostService.getHostInvitation(token);
        return {
            message: 'Host invitation retrieved successfully',
            invitation: {
                id: host.id,
                role: host.role,
                permissions: host.permissions,
                event: {
                    id: host.event.id,
                    title: host.event.title,
                    startDate: host.event.startDate,
                    endDate: host.event.endDate
                },
                invitedAt: host.invitedAt
            }
        };
    }
    async acceptInvitation(token, acceptDto) {
        const host = await this.hostService.acceptHostInvitation({ ...acceptDto, invitationToken: token });
        return { message: 'Host invitation accepted successfully', host };
    }
};
exports.HostInvitationController = HostInvitationController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostInvitationController.prototype, "getInvitation", null);
__decorate([
    (0, common_1.Post)(':token/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, host_dto_1.AcceptHostInvitationDto]),
    __metadata("design:returntype", Promise)
], HostInvitationController.prototype, "acceptInvitation", null);
exports.HostInvitationController = HostInvitationController = __decorate([
    (0, common_1.Controller)('host-invitations'),
    __metadata("design:paramtypes", [host_service_1.HostService])
], HostInvitationController);
//# sourceMappingURL=host.controller.js.map