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
exports.BoothManagementService = exports.BulkCreateBoothsDto = exports.CreateBoothDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_booth_entity_1 = require("../entities/event-booth.entity");
const event_entity_1 = require("../entities/event.entity");
class CreateBoothDto {
    boothNumber;
    boothType;
    section;
    floor;
    sizeWidth;
    sizeLength;
    sizeDescription;
    basePrice;
    premiumMultiplier;
    hasPower;
    powerOutlets;
    hasWifi;
    hasStorage;
    hasSink;
    maxOccupancy;
    description;
    specialRequirements;
    accessibilityFeatures;
}
exports.CreateBoothDto = CreateBoothDto;
class BulkCreateBoothsDto {
    template;
    boothNumbers;
    autoGenerate;
}
exports.BulkCreateBoothsDto = BulkCreateBoothsDto;
let BoothManagementService = class BoothManagementService {
    boothRepository;
    eventRepository;
    constructor(boothRepository, eventRepository) {
        this.boothRepository = boothRepository;
        this.eventRepository = eventRepository;
    }
    async createBooth(userId, eventId, createBoothDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const existingBooth = await this.boothRepository.findOne({
            where: { eventId, boothNumber: createBoothDto.boothNumber }
        });
        if (existingBooth) {
            throw new common_1.ConflictException(`Booth number ${createBoothDto.boothNumber} already exists for this event`);
        }
        const booth = this.boothRepository.create({
            eventId,
            ...createBoothDto,
            status: event_booth_entity_1.BoothStatus.AVAILABLE
        });
        return this.boothRepository.save(booth);
    }
    async bulkCreateBooths(userId, eventId, bulkCreateDto) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        let boothNumbers = [];
        if (bulkCreateDto.autoGenerate) {
            const { prefix, startNumber, count } = bulkCreateDto.autoGenerate;
            for (let i = 0; i < count; i++) {
                boothNumbers.push(`${prefix}${startNumber + i}`);
            }
        }
        else {
            boothNumbers = bulkCreateDto.boothNumbers;
        }
        const existingBooths = await this.boothRepository.find({
            where: { eventId },
            select: ['boothNumber']
        });
        const existingNumbers = existingBooths.map(b => b.boothNumber);
        const duplicates = boothNumbers.filter(num => existingNumbers.includes(num));
        if (duplicates.length > 0) {
            throw new common_1.ConflictException(`Booth numbers already exist: ${duplicates.join(', ')}`);
        }
        const booths = boothNumbers.map(boothNumber => this.boothRepository.create({
            eventId,
            boothNumber,
            status: event_booth_entity_1.BoothStatus.AVAILABLE,
            ...bulkCreateDto.template
        }));
        return this.boothRepository.save(booths);
    }
    async getEventBooths(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return this.boothRepository.find({
            where: { eventId },
            relations: ['vendor'],
            order: { boothNumber: 'ASC' }
        });
    }
    async getAvailableBooths(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return this.boothRepository.find({
            where: { eventId, status: event_booth_entity_1.BoothStatus.AVAILABLE },
            order: { boothNumber: 'ASC' }
        });
    }
    async assignBoothToVendor(userId, eventId, boothId, vendorId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const booth = await this.boothRepository.findOne({
            where: { id: boothId, eventId }
        });
        if (!booth) {
            throw new common_1.NotFoundException('Booth not found');
        }
        if (booth.status !== event_booth_entity_1.BoothStatus.AVAILABLE) {
            throw new common_1.BadRequestException('Booth is not available for assignment');
        }
        booth.vendorId = vendorId;
        booth.status = event_booth_entity_1.BoothStatus.RESERVED;
        return this.boothRepository.save(booth);
    }
    async generateBoothSuggestion(eventId, vendorRequirements) {
        let query = this.boothRepository.createQueryBuilder('booth')
            .where('booth.eventId = :eventId', { eventId })
            .andWhere('booth.status = :status', { status: event_booth_entity_1.BoothStatus.AVAILABLE });
        if (vendorRequirements) {
            if (vendorRequirements.preferredSection) {
                query = query.andWhere('booth.section = :section', { section: vendorRequirements.preferredSection });
            }
            if (vendorRequirements.needsPower) {
                query = query.andWhere('booth.hasPower = true');
            }
            if (vendorRequirements.needsWifi) {
                query = query.andWhere('booth.hasWifi = true');
            }
            if (vendorRequirements.needsStorage) {
                query = query.andWhere('booth.hasStorage = true');
            }
            if (vendorRequirements.needsSink) {
                query = query.andWhere('booth.hasSink = true');
            }
            if (vendorRequirements.maxPrice) {
                query = query.andWhere('booth.basePrice * booth.premiumMultiplier <= :maxPrice', { maxPrice: vendorRequirements.maxPrice });
            }
        }
        return query
            .orderBy('booth.basePrice * booth.premiumMultiplier', 'ASC')
            .addOrderBy('booth.boothNumber', 'ASC')
            .limit(10)
            .getMany();
    }
    async getBoothAnalytics(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        const booths = await this.boothRepository.find({
            where: { eventId }
        });
        const analytics = {
            total: booths.length,
            available: booths.filter(b => b.status === event_booth_entity_1.BoothStatus.AVAILABLE).length,
            reserved: booths.filter(b => b.status === event_booth_entity_1.BoothStatus.RESERVED).length,
            occupied: booths.filter(b => b.status === event_booth_entity_1.BoothStatus.OCCUPIED).length,
            maintenance: booths.filter(b => b.status === event_booth_entity_1.BoothStatus.MAINTENANCE).length,
            occupancyRate: booths.length > 0 ? ((booths.length - booths.filter(b => b.status === event_booth_entity_1.BoothStatus.AVAILABLE).length) / booths.length * 100).toFixed(2) : '0.00',
            totalRevenue: booths
                .filter(b => b.status !== event_booth_entity_1.BoothStatus.AVAILABLE)
                .reduce((sum, b) => sum + (b.basePrice * b.premiumMultiplier), 0),
            averagePrice: booths.length > 0 ? (booths.reduce((sum, b) => sum + (b.basePrice * b.premiumMultiplier), 0) / booths.length).toFixed(2) : '0.00',
            byType: {
                standard: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.STANDARD).length,
                premium: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.PREMIUM).length,
                corner: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.CORNER).length,
                island: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.ISLAND).length,
                food: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.FOOD).length,
                tech: booths.filter(b => b.boothType === event_booth_entity_1.BoothType.TECH).length,
            }
        };
        return analytics;
    }
};
exports.BoothManagementService = BoothManagementService;
exports.BoothManagementService = BoothManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_booth_entity_1.EventBooth)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BoothManagementService);
//# sourceMappingURL=booth-management.service.js.map