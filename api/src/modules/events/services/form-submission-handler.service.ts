import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventVendor, VendorStatus, VendorType } from '../entities/event-vendor.entity';
import { EventGuest, GuestStatus } from '../entities/event-guest.entity';
import { FormService } from '../../forms/services/form.service';

@Injectable()
export class FormSubmissionHandlerService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventVendor)
    private vendorRepository: Repository<EventVendor>,
    @InjectRepository(EventGuest)
    private guestRepository: Repository<EventGuest>,
    private formService: FormService,
  ) {}

  /**
   * Process vendor application form submission
   * This gets called when someone submits a vendor form linked to an event
   */
  async processVendorFormSubmission(formId: string, submissionId: string, userId?: string): Promise<EventVendor> {
    // Get the form to find which event it's linked to
    const form = await this.formService.getPublicForm(formId);
    if (!form || !form.eventContext || form.eventContext.formPurpose !== 'vendor') {
      throw new BadRequestException('Form is not linked to an event as vendor application');
    }

    const eventId = form.eventContext.eventId;
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Get form submissions to find the specific submission
    const submissions = await this.formService.getFormSubmissions(form.userId, formId);
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    // Extract vendor data from form submission
    const vendorData = this.extractVendorDataFromSubmission(submission);

    // Check if vendor already applied
    if (userId) {
      const existingVendor = await this.vendorRepository.findOne({
        where: { eventId, userId }
      });
      if (existingVendor) {
        throw new BadRequestException('You have already applied as a vendor for this event');
      }
    }

    // Create vendor application
    const vendor = this.vendorRepository.create({
      eventId,
      userId: userId || null,
      status: VendorStatus.APPLIED,
      appliedAt: new Date(),
      formSubmissionId: submissionId,
      contactName: vendorData.contactName || 'Unknown',
      contactEmail: vendorData.contactEmail || 'unknown@example.com',
      businessName: vendorData.businessName || 'Unknown Business',
      businessDescription: vendorData.businessDescription || '',
      vendorType: (vendorData.vendorType as VendorType) || VendorType.PRODUCT,
      ...vendorData
    });

    return this.vendorRepository.save(vendor) as unknown as EventVendor;
  }

  /**
   * Process guest registration form submission
   */
  async processGuestFormSubmission(formId: string, submissionId: string, userId?: string): Promise<EventGuest> {
    // Get the form to find which event it's linked to
    const form = await this.formService.getPublicForm(formId);
    if (!form || !form.eventContext || form.eventContext.formPurpose !== 'guest') {
      throw new BadRequestException('Form is not linked to an event as guest registration');
    }

    const eventId = form.eventContext.eventId;
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Get form submissions to find the specific submission
    const submissions = await this.formService.getFormSubmissions(form.userId, formId);
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    // Extract guest data from form submission
    const guestData = this.extractGuestDataFromSubmission(submission);

    // Check if guest already registered
    if (userId) {
      const existingGuest = await this.guestRepository.findOne({
        where: { eventId, userId }
      });
      if (existingGuest) {
        throw new BadRequestException('You are already registered for this event');
      }
    }

    // Create guest registration
    const guest = this.guestRepository.create({
      eventId,
      userId: userId || null,
      status: event.requireApproval ? GuestStatus.INVITED : GuestStatus.REGISTERED,
      registeredAt: new Date(),
      formSubmissionId: submissionId,
      guestName: guestData.guestName || 'Unknown',
      guestEmail: guestData.guestEmail || 'unknown@example.com',
      ...guestData
    });

    return this.guestRepository.save(guest) as unknown as EventGuest;
  }

  /**
   * Get vendor applications from form submissions
   */
  async getVendorApplicationsFromForms(userId: string, eventId: string): Promise<any[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });
    if (!event || !event.vendorFormId) {
      return [];
    }

    // Get all form submissions for the vendor form
    const submissions = await this.formService.getFormSubmissions(userId, event.vendorFormId);
    
    // Get corresponding vendor applications
    const vendors = await this.vendorRepository.find({
      where: { eventId },
      relations: ['user']
    });

    // Merge form data with vendor applications
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

  /**
   * Get guest registrations from form submissions
   */
  async getGuestRegistrationsFromForms(userId: string, eventId: string): Promise<any[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });
    if (!event || !event.guestFormId) {
      return [];
    }

    // Get all form submissions for the guest form
    const submissions = await this.formService.getFormSubmissions(userId, event.guestFormId);
    
    // Get corresponding guest registrations
    const guests = await this.guestRepository.find({
      where: { eventId },
      relations: ['user']
    });

    // Merge form data with guest registrations
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

  /**
   * Approve vendor from form submission
   */
  async approveVendorFromForm(userId: string, eventId: string, submissionId: string, approvalData: {
    boothId?: string;
    vendorFee?: number;
    commissionRate?: number;
    reviewNotes?: string;
    paymentDueDate?: string;
  }): Promise<EventVendor> {
    // Verify event ownership
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });
    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Find vendor by form submission
    let vendor = await this.vendorRepository.findOne({
      where: { eventId, formSubmissionId: submissionId }
    });

    if (!vendor) {
      // Create vendor from form submission if doesn't exist
      vendor = await this.processVendorFormSubmission(event.vendorFormId!, submissionId);
    }

    // Calculate payment due date (default: 7 days from approval)
    const paymentDueDate = approvalData.paymentDueDate 
      ? new Date(approvalData.paymentDueDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update vendor with approval data
    Object.assign(vendor, {
      status: VendorStatus.APPROVED,
      reviewedAt: new Date(),
      vendorFee: approvalData.vendorFee || event.vendorFee || 0,
      commissionRate: approvalData.commissionRate || 5.0,
      paymentDueDate,
      boothId: approvalData.boothId || null,
      reviewNotes: approvalData.reviewNotes,
      ...approvalData
    });

    const savedVendor = await this.vendorRepository.save(vendor) as unknown as EventVendor;

    // If booth is assigned, update booth status
    if (approvalData.boothId) {
      // TODO: Update booth status to RESERVED
      // This would require injecting BoothManagementService
    }

    return savedVendor;
  }

  private extractVendorDataFromSubmission(submission: any): Partial<EventVendor> {
    // Map form fields to vendor properties
    // This would be customizable based on form field labels/IDs
    const data: any = {};
    
    Object.entries(submission.submissionData).forEach(([fieldId, value]) => {
      // You could have a mapping configuration here
      // For now, we'll use common field patterns
      if (typeof value === 'string') {
        if (value.toLowerCase().includes('business') && value.toLowerCase().includes('name')) {
          data.businessName = value;
        } else if (value.toLowerCase().includes('email')) {
          data.contactEmail = value;
        } else if (value.toLowerCase().includes('phone')) {
          data.contactPhone = value;
        }
        // Add more mappings as needed
      }
    });

    return data;
  }

  private extractGuestDataFromSubmission(submission: any): Partial<EventGuest> {
    // Similar mapping for guest data
    const data: any = {};
    
    Object.entries(submission.submissionData).forEach(([fieldId, value]) => {
      if (typeof value === 'string') {
        if (value.toLowerCase().includes('name')) {
          data.guestName = value;
        } else if (value.toLowerCase().includes('email')) {
          data.guestEmail = value;
        } else if (value.toLowerCase().includes('phone')) {
          data.guestPhone = value;
        } else if (value.toLowerCase().includes('company')) {
          data.guestCompany = value;
        }
      }
    });

    return data;
  }
}
