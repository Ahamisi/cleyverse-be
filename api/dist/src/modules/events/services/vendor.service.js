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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_vendor_entity_1 = require("../entities/event-vendor.entity");
const event_product_entity_1 = require("../entities/event-product.entity");
const event_entity_1 = require("../entities/event.entity");
let VendorService = class VendorService {
    vendorRepository;
    eventProductRepository;
    eventRepository;
    constructor(vendorRepository, eventProductRepository, eventRepository) {
        this.vendorRepository = vendorRepository;
        this.eventProductRepository = eventProductRepository;
        this.eventRepository = eventRepository;
    }
    async applyAsVendor(userId, eventId, applyDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (!event.allowVendors) {
            throw new common_1.BadRequestException('This event does not allow vendors');
        }
        if (event.vendorApplicationDeadline && new Date() > event.vendorApplicationDeadline) {
            throw new common_1.BadRequestException('Vendor application deadline has passed');
        }
        if ([event_entity_1.EventStatus.COMPLETED, event_entity_1.EventStatus.CANCELLED, event_entity_1.EventStatus.ARCHIVED].includes(event.status)) {
            throw new common_1.BadRequestException('Cannot apply to completed, cancelled, or archived events');
        }
        const existingApplication = await this.vendorRepository.findOne({
            where: { eventId, userId }
        });
        if (existingApplication) {
            throw new common_1.ConflictException('You have already applied as a vendor for this event');
        }
        const vendor = this.vendorRepository.create({
            ...applyDto,
            eventId,
            userId,
            status: event_vendor_entity_1.VendorStatus.APPLIED,
            appliedAt: new Date()
        });
        return this.vendorRepository.save(vendor);
    }
    async updateVendorApplication(userId, eventId, updateDto) {
        const vendor = await this.vendorRepository.findOne({
            where: { eventId, userId },
            relations: ['event']
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor application not found');
        }
        if (![event_vendor_entity_1.VendorStatus.APPLIED, event_vendor_entity_1.VendorStatus.UNDER_REVIEW].includes(vendor.status)) {
            throw new common_1.BadRequestException('Cannot update application after it has been reviewed');
        }
        if (vendor.event.vendorApplicationDeadline && new Date() > vendor.event.vendorApplicationDeadline) {
            throw new common_1.BadRequestException('Vendor application deadline has passed');
        }
        Object.assign(vendor, updateDto);
        return this.vendorRepository.save(vendor);
    }
    async reviewVendorApplication(userId, eventId, vendorId, reviewDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId, eventId }
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor application not found');
        }
        if (![event_vendor_entity_1.VendorStatus.APPLIED, event_vendor_entity_1.VendorStatus.UNDER_REVIEW].includes(vendor.status)) {
            throw new common_1.BadRequestException('Vendor application has already been reviewed');
        }
        if (![event_vendor_entity_1.VendorStatus.APPROVED, event_vendor_entity_1.VendorStatus.REJECTED].includes(reviewDto.status)) {
            throw new common_1.BadRequestException('Invalid review status');
        }
        vendor.status = reviewDto.status;
        vendor.reviewedAt = new Date();
        vendor.reviewedBy = userId;
        vendor.reviewNotes = reviewDto.reviewNotes || null;
        if (reviewDto.status === event_vendor_entity_1.VendorStatus.APPROVED) {
            vendor.boothNumber = reviewDto.boothNumber || null;
            vendor.boothLocation = reviewDto.boothLocation || null;
            vendor.vendorFee = reviewDto.vendorFee || event.vendorFee;
            vendor.commissionRate = reviewDto.commissionRate || null;
        }
        return this.vendorRepository.save(vendor);
    }
    async updateVendorBooth(userId, eventId, vendorId, updateBoothDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId, eventId }
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        if (vendor.status !== event_vendor_entity_1.VendorStatus.APPROVED) {
            throw new common_1.BadRequestException('Vendor must be approved to update booth details');
        }
        Object.assign(vendor, {
            ...updateBoothDto,
            setupTime: updateBoothDto.setupTime ? new Date(updateBoothDto.setupTime) : undefined,
            breakdownTime: updateBoothDto.breakdownTime ? new Date(updateBoothDto.breakdownTime) : undefined
        });
        return this.vendorRepository.save(vendor);
    }
    async linkProductToEvent(userId, eventId, linkDto) {
        const vendor = await this.vendorRepository.findOne({
            where: { eventId, userId, status: event_vendor_entity_1.VendorStatus.APPROVED }
        });
        if (!vendor) {
            throw new common_1.NotFoundException('You are not an approved vendor for this event');
        }
        const existingLink = await this.eventProductRepository.findOne({
            where: { eventId, productId: linkDto.productId }
        });
        if (existingLink) {
            throw new common_1.ConflictException('Product is already linked to this event');
        }
        const eventProduct = this.eventProductRepository.create({
            ...linkDto,
            eventId,
            vendorId: vendor.id,
            status: event_product_entity_1.EventProductStatus.PENDING
        });
        return this.eventProductRepository.save(eventProduct);
    }
    async approveEventProduct(userId, eventId, productId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const eventProduct = await this.eventProductRepository.findOne({
            where: { id: productId, eventId }
        });
        if (!eventProduct) {
            throw new common_1.NotFoundException('Event product not found');
        }
        eventProduct.status = event_product_entity_1.EventProductStatus.APPROVED;
        eventProduct.approvedBy = userId;
        eventProduct.approvedAt = new Date();
        return this.eventProductRepository.save(eventProduct);
    }
    async rejectEventProduct(userId, eventId, productId, reason) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const eventProduct = await this.eventProductRepository.findOne({
            where: { id: productId, eventId }
        });
        if (!eventProduct) {
            throw new common_1.NotFoundException('Event product not found');
        }
        eventProduct.status = event_product_entity_1.EventProductStatus.REJECTED;
        eventProduct.rejectionReason = reason;
        return this.eventProductRepository.save(eventProduct);
    }
    async getEventVendors(userId, eventId, searchDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const queryBuilder = this.vendorRepository.createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.user', 'user')
            .leftJoinAndSelect('vendor.store', 'store')
            .where('vendor.eventId = :eventId', { eventId });
        if (searchDto) {
            if (searchDto.search) {
                queryBuilder.andWhere('(vendor.businessName ILIKE :search OR vendor.contactName ILIKE :search OR vendor.contactEmail ILIKE :search)', { search: `%${searchDto.search}%` });
            }
            if (searchDto.status) {
                queryBuilder.andWhere('vendor.status = :status', { status: searchDto.status });
            }
            if (searchDto.vendorType) {
                queryBuilder.andWhere('vendor.vendorType = :vendorType', { vendorType: searchDto.vendorType });
            }
            if (searchDto.isFeatured !== undefined) {
                queryBuilder.andWhere('vendor.isFeatured = :isFeatured', { isFeatured: searchDto.isFeatured });
            }
            queryBuilder.orderBy(`vendor.${searchDto.sortBy}`, searchDto.sortOrder);
        }
        else {
            queryBuilder.orderBy('vendor.displayOrder', 'ASC').addOrderBy('vendor.createdAt', 'DESC');
        }
        return queryBuilder.getMany();
    }
    async getPublicEventVendors(eventId) {
        return this.vendorRepository.find({
            where: {
                eventId,
                status: event_vendor_entity_1.VendorStatus.APPROVED,
                isActive: true
            },
            relations: ['user', 'store'],
            order: {
                isFeatured: 'DESC',
                displayOrder: 'ASC',
                businessName: 'ASC'
            }
        });
    }
    async getEventProducts(eventId, vendorId) {
        const whereClause = {
            eventId,
            status: event_product_entity_1.EventProductStatus.APPROVED
        };
        if (vendorId) {
            whereClause.vendorId = vendorId;
        }
        return this.eventProductRepository.find({
            where: whereClause,
            relations: ['product', 'vendor'],
            order: {
                isFeatured: 'DESC',
                displayOrder: 'ASC'
            }
        });
    }
    async getVendorApplication(userId, eventId) {
        const vendor = await this.vendorRepository.findOne({
            where: { eventId, userId },
            relations: ['event', 'store']
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor application not found');
        }
        return vendor;
    }
    async cancelVendorApplication(userId, eventId) {
        const vendor = await this.vendorRepository.findOne({
            where: { eventId, userId }
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor application not found');
        }
        if (vendor.status === event_vendor_entity_1.VendorStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot cancel approved vendor application. Contact event organizer.');
        }
        vendor.status = event_vendor_entity_1.VendorStatus.CANCELLED;
        await this.vendorRepository.save(vendor);
    }
    async getVendorAnalytics(userId, eventId, vendorId) {
        const vendor = await this.vendorRepository.findOne({
            where: { id: vendorId, eventId },
            relations: ['event']
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        if (vendor.userId !== userId && vendor.event.creatorId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const productStats = await this.eventProductRepository
            .createQueryBuilder('eventProduct')
            .select([
            'COUNT(*) as totalProducts',
            'COUNT(CASE WHEN eventProduct.status = \'approved\' THEN 1 END) as approvedProducts',
            'SUM(eventProduct.viewCount) as totalViews',
            'SUM(eventProduct.ordersCount) as totalOrders',
            'SUM(eventProduct.totalRevenue) as totalRevenue'
        ])
            .where('eventProduct.vendorId = :vendorId', { vendorId })
            .getRawOne();
        return {
            vendor: {
                id: vendor.id,
                businessName: vendor.businessName,
                status: vendor.status,
                boothNumber: vendor.boothNumber,
                totalSales: vendor.totalSales,
                totalOrders: vendor.totalOrders,
                boothVisits: vendor.boothVisits
            },
            products: {
                total: parseInt(productStats.totalProducts) || 0,
                approved: parseInt(productStats.approvedProducts) || 0,
                totalViews: parseInt(productStats.totalViews) || 0,
                totalOrders: parseInt(productStats.totalOrders) || 0,
                totalRevenue: parseFloat(productStats.totalRevenue) || 0
            }
        };
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_vendor_entity_1.EventVendor)),
    __param(1, (0, typeorm_1.InjectRepository)(event_product_entity_1.EventProduct)),
    __param(2, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VendorService);
//# sourceMappingURL=vendor.service.js.map