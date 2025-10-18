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
exports.DigitalAccessController = exports.AccessVerificationDto = void 0;
const common_1 = require("@nestjs/common");
const digital_delivery_service_1 = require("../services/digital-delivery.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const digital_access_entity_1 = require("../entities/digital-access.entity");
class AccessVerificationDto {
    password;
    deviceFingerprint;
}
exports.AccessVerificationDto = AccessVerificationDto;
let DigitalAccessController = class DigitalAccessController {
    digitalDeliveryService;
    digitalAccessRepository;
    constructor(digitalDeliveryService, digitalAccessRepository) {
        this.digitalDeliveryService = digitalDeliveryService;
        this.digitalAccessRepository = digitalAccessRepository;
    }
    async verifyAccess(accessToken, query, req, res) {
        const { access, digitalProduct, fileStream } = await this.digitalDeliveryService.verifyAccess(accessToken, query.password, query.deviceFingerprint, req.ip, req.get('User-Agent'));
        res.setHeader('Content-Type', digitalProduct.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${digitalProduct.fileName}"`);
        res.setHeader('Content-Length', digitalProduct.fileSize);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(fileStream);
    }
    async downloadFile(accessToken, query, req, res) {
        const { access, digitalProduct, fileStream } = await this.digitalDeliveryService.verifyAccess(accessToken, query.password, query.deviceFingerprint, req.ip, req.get('User-Agent'));
        access.downloadCount += 1;
        await this.digitalAccessRepository.save(access);
        res.setHeader('Content-Type', digitalProduct.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${digitalProduct.fileName}"`);
        res.setHeader('Content-Length', digitalProduct.fileSize);
        res.send(fileStream);
    }
};
exports.DigitalAccessController = DigitalAccessController;
__decorate([
    (0, common_1.Get)(':accessToken'),
    __param(0, (0, common_1.Param)('accessToken')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AccessVerificationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DigitalAccessController.prototype, "verifyAccess", null);
__decorate([
    (0, common_1.Get)(':accessToken/download'),
    __param(0, (0, common_1.Param)('accessToken')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AccessVerificationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DigitalAccessController.prototype, "downloadFile", null);
exports.DigitalAccessController = DigitalAccessController = __decorate([
    (0, common_1.Controller)('digital-access'),
    __param(1, (0, typeorm_1.InjectRepository)(digital_access_entity_1.DigitalAccess)),
    __metadata("design:paramtypes", [digital_delivery_service_1.DigitalDeliveryService,
        typeorm_2.Repository])
], DigitalAccessController);
//# sourceMappingURL=digital-access.controller.js.map