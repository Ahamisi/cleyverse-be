"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const digital_product_entity_1 = require("../entities/digital-product.entity");
const digital_access_entity_1 = require("../entities/digital-access.entity");
const order_entity_1 = require("../entities/order.entity");
const email_service_1 = require("../../../shared/services/email.service");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let DigitalDeliveryService = class DigitalDeliveryService {
    digitalProductRepository;
    digitalAccessRepository;
    orderRepository;
    emailService;
    constructor(digitalProductRepository, digitalAccessRepository, orderRepository, emailService) {
        this.digitalProductRepository = digitalProductRepository;
        this.digitalAccessRepository = digitalAccessRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }
    async createDigitalAccess(digitalProductId, orderId, customerEmail, customerName, userId) {
        const digitalProduct = await this.digitalProductRepository.findOne({
            where: { id: digitalProductId, isActive: true },
            relations: ['product']
        });
        if (!digitalProduct) {
            throw new common_1.NotFoundException('Digital product not found');
        }
        const order = await this.orderRepository.findOne({
            where: { id: orderId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const accessToken = this.generateAccessToken();
        const accessPassword = digitalProduct.accessControlType === 'password_protected'
            ? this.generateAccessPassword()
            : null;
        const expiresAt = digitalProduct.accessDurationHours
            ? new Date(Date.now() + digitalProduct.accessDurationHours * 60 * 60 * 1000)
            : null;
        const digitalAccess = this.digitalAccessRepository.create({
            digitalProductId,
            userId: userId || null,
            orderId,
            customerEmail,
            customerName,
            accessType: digital_access_entity_1.AccessType.PURCHASE,
            status: digital_access_entity_1.AccessStatus.ACTIVE,
            accessToken,
            accessPassword,
            expiresAt,
            maxDownloads: digitalProduct.maxDownloads,
            watermarkText: digitalProduct.watermarkText,
            watermarkPosition: 'bottom-right',
            deviceFingerprint: null,
            ipAddress: null,
            userAgent: null,
            allowedIps: digitalProduct.allowedIps,
            deliveryEmailTemplate: digitalProduct.deliveryEmailTemplate,
            metadata: {
                orderNumber: order.orderNumber,
                productTitle: digitalProduct.product.title,
                purchaseDate: new Date()
            }
        });
        const savedAccess = await this.digitalAccessRepository.save(digitalAccess);
        if (digitalProduct.autoDeliver) {
            await this.sendDeliveryEmail(savedAccess);
        }
        return savedAccess;
    }
    async sendDeliveryEmail(digitalAccess) {
        const digitalProduct = await this.digitalProductRepository.findOne({
            where: { id: digitalAccess.digitalProductId },
            relations: ['product', 'product.store']
        });
        if (!digitalProduct) {
            throw new common_1.NotFoundException('Digital product not found');
        }
        const accessUrl = `${process.env.FRONTEND_URL}/digital-access/${digitalAccess.accessToken}`;
        const emailData = {
            to: digitalAccess.customerEmail,
            subject: digitalProduct.deliverySubject || `Your ${digitalProduct.product.title} is ready!`,
            template: digitalProduct.deliveryEmailTemplate || 'digital-product-delivery',
            data: {
                customerName: digitalAccess.customerName || 'Valued Customer',
                productTitle: digitalProduct.product.title,
                storeName: digitalProduct.product.store.name,
                accessUrl,
                accessPassword: digitalAccess.accessPassword,
                expiresAt: digitalAccess.expiresAt,
                maxDownloads: digitalAccess.maxDownloads,
                downloadInstructions: this.getDownloadInstructions(digitalProduct.digitalType),
                supportEmail: digitalProduct.product.store.user.email,
                orderNumber: digitalAccess.metadata?.orderNumber
            }
        };
        try {
            await this.emailService.sendEmail(emailData);
            digitalAccess.deliveryEmailSent = true;
            digitalAccess.deliveryEmailSentAt = new Date();
            await this.digitalAccessRepository.save(digitalAccess);
        }
        catch (error) {
            console.error('Failed to send delivery email:', error);
        }
    }
    async verifyAccess(accessToken, password, deviceFingerprint, ipAddress, userAgent) {
        const access = await this.digitalAccessRepository.findOne({
            where: { accessToken },
            relations: ['digitalProduct', 'digitalProduct.product']
        });
        if (!access) {
            throw new common_1.NotFoundException('Invalid access token');
        }
        if (access.status !== digital_access_entity_1.AccessStatus.ACTIVE) {
            throw new common_1.ForbiddenException('Access has been revoked or suspended');
        }
        if (access.expiresAt && access.expiresAt < new Date()) {
            access.status = digital_access_entity_1.AccessStatus.EXPIRED;
            await this.digitalAccessRepository.save(access);
            throw new common_1.ForbiddenException('Access has expired');
        }
        if (access.accessPassword && access.accessPassword !== password) {
            throw new common_1.ForbiddenException('Invalid access password');
        }
        if (access.downloadCount >= access.maxDownloads) {
            throw new common_1.ForbiddenException('Download limit exceeded');
        }
        const digitalProduct = await this.digitalProductRepository.findOne({
            where: { id: access.digitalProductId }
        });
        if (digitalProduct && access.concurrentSessions >= digitalProduct.maxConcurrentUsers) {
            throw new common_1.ForbiddenException('Maximum concurrent users reached');
        }
        access.lastAccessedAt = new Date();
        access.accessCount += 1;
        access.deviceFingerprint = deviceFingerprint || null;
        access.ipAddress = ipAddress || null;
        access.userAgent = userAgent || null;
        await this.digitalAccessRepository.save(access);
        const fileStream = await this.getSecureFileStream(digitalProduct);
        return { access, digitalProduct: digitalProduct, fileStream };
    }
    async getSecureFileStream(digitalProduct) {
        try {
            const filePath = path.join(process.env.DIGITAL_FILES_PATH || './uploads/digital', digitalProduct.filePath);
            const fileBuffer = await fs.readFile(filePath);
            if (digitalProduct.watermarkEnabled && digitalProduct.watermarkText) {
                return await this.applyWatermark(fileBuffer, digitalProduct);
            }
            return fileBuffer;
        }
        catch (error) {
            throw new common_1.NotFoundException('Digital file not found');
        }
    }
    async applyWatermark(fileBuffer, digitalProduct) {
        if (digitalProduct.digitalType === 'pdf' || digitalProduct.digitalType === 'ebook') {
            return fileBuffer;
        }
        return fileBuffer;
    }
    generateAccessToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    generateAccessPassword() {
        return crypto.randomBytes(8).toString('hex');
    }
    getDownloadInstructions(digitalType) {
        switch (digitalType) {
            case 'ebook':
                return 'You can read your ebook directly in our secure viewer or download it to your device.';
            case 'pdf':
                return 'You can view your PDF in our secure viewer or download it to your device.';
            case 'audio':
                return 'You can stream your audio file or download it to your device.';
            case 'video':
                return 'You can stream your video or download it to your device.';
            case 'software':
                return 'Download and install the software on your device.';
            case 'course':
                return 'Access your course materials and start learning immediately.';
            default:
                return 'Download your digital product to your device.';
        }
    }
    async revokeAccess(accessId, reason) {
        const access = await this.digitalAccessRepository.findOne({
            where: { id: accessId }
        });
        if (!access) {
            throw new common_1.NotFoundException('Access record not found');
        }
        access.status = digital_access_entity_1.AccessStatus.REVOKED;
        access.notes = reason || 'Access revoked by administrator';
        await this.digitalAccessRepository.save(access);
    }
    async getAccessAnalytics(digitalProductId) {
        const [totalAccess, activeAccess, recentAccess] = await Promise.all([
            this.digitalAccessRepository.count({ where: { digitalProductId } }),
            this.digitalAccessRepository.count({ where: { digitalProductId, status: digital_access_entity_1.AccessStatus.ACTIVE } }),
            this.digitalAccessRepository.find({
                where: { digitalProductId },
                order: { lastAccessedAt: 'DESC' },
                take: 10,
                relations: ['user']
            })
        ]);
        const stats = await this.digitalAccessRepository
            .createQueryBuilder('access')
            .select([
            'SUM(access.downloadCount) as totalDownloads',
            'SUM(access.accessCount) as totalViews',
            'COUNT(DISTINCT access.customerEmail) as uniqueUsers'
        ])
            .where('access.digitalProductId = :digitalProductId', { digitalProductId })
            .getRawOne();
        return {
            totalAccess,
            activeAccess,
            totalDownloads: parseInt(stats.totalDownloads) || 0,
            totalViews: parseInt(stats.totalViews) || 0,
            uniqueUsers: parseInt(stats.uniqueUsers) || 0,
            recentAccess
        };
    }
};
exports.DigitalDeliveryService = DigitalDeliveryService;
exports.DigitalDeliveryService = DigitalDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(digital_product_entity_1.DigitalProduct)),
    __param(1, (0, typeorm_1.InjectRepository)(digital_access_entity_1.DigitalAccess)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], DigitalDeliveryService);
//# sourceMappingURL=digital-delivery.service.js.map