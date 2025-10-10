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
exports.EventFormService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
const form_service_1 = require("../../forms/services/form.service");
let EventFormService = class EventFormService {
    eventRepository;
    formService;
    constructor(eventRepository, formService) {
        this.eventRepository = eventRepository;
        this.formService = formService;
    }
    async setVendorForm(userId, eventId, formId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        await this.formService.linkToEvent(userId, formId, eventId, 'vendor', event.title, event.slug);
        event.vendorFormId = formId;
        return this.eventRepository.save(event);
    }
    async setGuestForm(userId, eventId, formId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        await this.formService.linkToEvent(userId, formId, eventId, 'guest', event.title, event.slug);
        event.guestFormId = formId;
        return this.eventRepository.save(event);
    }
    async removeVendorForm(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (event.vendorFormId) {
            await this.formService.unlinkFromEvent(userId, event.vendorFormId);
        }
        event.vendorFormId = null;
        return this.eventRepository.save(event);
    }
    async removeGuestForm(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        if (event.guestFormId) {
            await this.formService.unlinkFromEvent(userId, event.guestFormId);
        }
        event.guestFormId = null;
        return this.eventRepository.save(event);
    }
    async getEventForms(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        return {
            vendorFormId: event.vendorFormId,
            guestFormId: event.guestFormId
        };
    }
    async getPublicEventForms(eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return {
            vendorFormId: event.vendorFormId,
            guestFormId: event.guestFormId
        };
    }
    async getAllEventLinkedForms(eventId) {
        return this.formService.getEventLinkedForms(eventId);
    }
};
exports.EventFormService = EventFormService;
exports.EventFormService = EventFormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        form_service_1.FormService])
], EventFormService);
//# sourceMappingURL=event-form.service.js.map