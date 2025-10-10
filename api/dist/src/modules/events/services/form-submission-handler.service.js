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
exports.FormSubmissionHandlerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../entities/event.entity");
const event_vendor_entity_1 = require("../entities/event-vendor.entity");
const event_guest_entity_1 = require("../entities/event-guest.entity");
const form_service_1 = require("../../forms/services/form.service");
let FormSubmissionHandlerService = class FormSubmissionHandlerService {
    eventRepository;
    vendorRepository;
    guestRepository;
    formService;
    constructor(eventRepository, vendorRepository, guestRepository, formService) {
        this.eventRepository = eventRepository;
        this.vendorRepository = vendorRepository;
        this.guestRepository = guestRepository;
        this.formService = formService;
    }
    async processVendorFormSubmission(formId, submissionId, userId) {
        const form = await this.formService.getPublicForm(formId);
        if (!form || !form.eventContext || form.eventContext.formPurpose !== 'vendor') {
            throw new common_1.BadRequestException('Form is not linked to an event as vendor application');
        }
        const eventId = form.eventContext.eventId;
        const event = await this.eventRepository.findOne({ where: { id: eventId } });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const submissions = await this.formService.getFormSubmissions(form.userId, formId);
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) {
            throw new common_1.NotFoundException('Form submission not found');
        }
        const vendorData = this.extractVendorDataFromSubmission(submission);
        if (userId) {
            const existingVendor = await this.vendorRepository.findOne({
                where: { eventId, userId }
            });
            if (existingVendor) {
                throw new common_1.BadRequestException('You have already applied as a vendor for this event');
            }
        }
        const vendor = this.vendorRepository.create({
            eventId,
            userId: userId || null,
            status: event_vendor_entity_1.VendorStatus.APPLIED,
            appliedAt: new Date(),
            formSubmissionId: submissionId,
            contactName: vendorData.contactName || 'Unknown',
            contactEmail: vendorData.contactEmail || 'unknown@example.com',
            businessName: vendorData.businessName || 'Unknown Business',
            businessDescription: vendorData.businessDescription || '',
            vendorType: vendorData.vendorType || event_vendor_entity_1.VendorType.PRODUCT,
            ...vendorData
        });
        return this.vendorRepository.save(vendor);
    }
    async processGuestFormSubmission(formId, submissionId, userId) {
        const form = await this.formService.getPublicForm(formId);
        if (!form || !form.eventContext || form.eventContext.formPurpose !== 'guest') {
            throw new common_1.BadRequestException('Form is not linked to an event as guest registration');
        }
        const eventId = form.eventContext.eventId;
        const event = await this.eventRepository.findOne({ where: { id: eventId } });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const submissions = await this.formService.getFormSubmissions(form.userId, formId);
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) {
            throw new common_1.NotFoundException('Form submission not found');
        }
        const guestData = this.extractGuestDataFromSubmission(submission);
        if (userId) {
            const existingGuest = await this.guestRepository.findOne({
                where: { eventId, userId }
            });
            if (existingGuest) {
                throw new common_1.BadRequestException('You are already registered for this event');
            }
        }
        const guest = this.guestRepository.create({
            eventId,
            userId: userId || null,
            status: event.requireApproval ? event_guest_entity_1.GuestStatus.INVITED : event_guest_entity_1.GuestStatus.REGISTERED,
            registeredAt: new Date(),
            formSubmissionId: submissionId,
            guestName: guestData.guestName || 'Unknown',
            guestEmail: guestData.guestEmail || 'unknown@example.com',
            ...guestData
        });
        return this.guestRepository.save(guest);
    }
    async getVendorApplicationsFromForms(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event || !event.vendorFormId) {
            return [];
        }
        const submissions = await this.formService.getFormSubmissions(userId, event.vendorFormId);
        const vendors = await this.vendorRepository.find({
            where: { eventId },
            relations: ['user']
        });
        return submissions.map(submission => {
            const vendor = vendors.find(v => v.formSubmissionId === submission.id);
            return {
                submissionId: submission.id,
                submittedAt: submission.createdAt,
                formData: submission.submissionData,
                vendor: vendor || null,
                status: vendor?.status || 'pending_review'
            };
        });
    }
    async getGuestRegistrationsFromForms(userId, eventId) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event || !event.guestFormId) {
            return [];
        }
        const submissions = await this.formService.getFormSubmissions(userId, event.guestFormId);
        const guests = await this.guestRepository.find({
            where: { eventId },
            relations: ['user']
        });
        return submissions.map(submission => {
            const guest = guests.find(g => g.formSubmissionId === submission.id);
            return {
                submissionId: submission.id,
                submittedAt: submission.createdAt,
                formData: submission.submissionData,
                guest: guest || null,
                status: guest?.status || 'pending_review'
            };
        });
    }
    async approveVendorFromForm(userId, eventId, submissionId, approvalData) {
        const event = await this.eventRepository.findOne({
            where: { id: eventId, creatorId: userId }
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or does not belong to user');
        }
        let vendor = await this.vendorRepository.findOne({
            where: { eventId, formSubmissionId: submissionId }
        });
        if (!vendor) {
            vendor = await this.processVendorFormSubmission(event.vendorFormId, submissionId);
        }
        const paymentDueDate = approvalData.paymentDueDate
            ? new Date(approvalData.paymentDueDate)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        Object.assign(vendor, {
            status: event_vendor_entity_1.VendorStatus.APPROVED,
            reviewedAt: new Date(),
            vendorFee: approvalData.vendorFee || event.vendorFee || 0,
            commissionRate: approvalData.commissionRate || 5.0,
            paymentDueDate,
            boothId: approvalData.boothId || null,
            reviewNotes: approvalData.reviewNotes,
            ...approvalData
        });
        const savedVendor = await this.vendorRepository.save(vendor);
        if (approvalData.boothId) {
        }
        return savedVendor;
    }
    extractVendorDataFromSubmission(submission) {
        const data = {};
        Object.entries(submission.submissionData).forEach(([fieldId, value]) => {
            if (typeof value === 'string') {
                if (value.toLowerCase().includes('business') && value.toLowerCase().includes('name')) {
                    data.businessName = value;
                }
                else if (value.toLowerCase().includes('email')) {
                    data.contactEmail = value;
                }
                else if (value.toLowerCase().includes('phone')) {
                    data.contactPhone = value;
                }
            }
        });
        return data;
    }
    extractGuestDataFromSubmission(submission) {
        const data = {};
        Object.entries(submission.submissionData).forEach(([fieldId, value]) => {
            if (typeof value === 'string') {
                if (value.toLowerCase().includes('name')) {
                    data.guestName = value;
                }
                else if (value.toLowerCase().includes('email')) {
                    data.guestEmail = value;
                }
                else if (value.toLowerCase().includes('phone')) {
                    data.guestPhone = value;
                }
                else if (value.toLowerCase().includes('company')) {
                    data.guestCompany = value;
                }
            }
        });
        return data;
    }
};
exports.FormSubmissionHandlerService = FormSubmissionHandlerService;
exports.FormSubmissionHandlerService = FormSubmissionHandlerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(event_vendor_entity_1.EventVendor)),
    __param(2, (0, typeorm_1.InjectRepository)(event_guest_entity_1.EventGuest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        form_service_1.FormService])
], FormSubmissionHandlerService);
//# sourceMappingURL=form-submission-handler.service.js.map