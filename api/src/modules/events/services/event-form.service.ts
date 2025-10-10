import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { FormService } from '../../forms/services/form.service';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private formService: FormService,
  ) {}

  async setVendorForm(userId: string, eventId: string, formId: string): Promise<Event> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Link form to event in Forms module
    await this.formService.linkToEvent(userId, formId, eventId, 'vendor', event.title, event.slug);

    event.vendorFormId = formId;
    return this.eventRepository.save(event) as unknown as Event;
  }

  async setGuestForm(userId: string, eventId: string, formId: string): Promise<Event> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Link form to event in Forms module
    await this.formService.linkToEvent(userId, formId, eventId, 'guest', event.title, event.slug);

    event.guestFormId = formId;
    return this.eventRepository.save(event) as unknown as Event;
  }

  async removeVendorForm(userId: string, eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Unlink form from event in Forms module
    if (event.vendorFormId) {
      await this.formService.unlinkFromEvent(userId, event.vendorFormId);
    }

    event.vendorFormId = null;
    return this.eventRepository.save(event) as unknown as Event;
  }

  async removeGuestForm(userId: string, eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    // Unlink form from event in Forms module
    if (event.guestFormId) {
      await this.formService.unlinkFromEvent(userId, event.guestFormId);
    }

    event.guestFormId = null;
    return this.eventRepository.save(event) as unknown as Event;
  }

  async getEventForms(userId: string, eventId: string): Promise<{ vendorFormId: string | null; guestFormId: string | null }> {
    // Check if user is event owner or has access
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    return {
      vendorFormId: event.vendorFormId,
      guestFormId: event.guestFormId
    };
  }

  async getPublicEventForms(eventId: string): Promise<{ vendorFormId: string | null; guestFormId: string | null }> {
    // Public access to form IDs for vendors/guests to fill out
    const event = await this.eventRepository.findOne({
      where: { id: eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      vendorFormId: event.vendorFormId,
      guestFormId: event.guestFormId
    };
  }

  async getAllEventLinkedForms(eventId: string) {
    return this.formService.getEventLinkedForms(eventId);
  }
}
