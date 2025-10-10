import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { EventFormService } from '../services/event-form.service';

@Controller('events/:eventId/forms')
export class EventFormController {
  constructor(private readonly eventFormService: EventFormService) {}

  @Post('vendor')
  @UseGuards(JwtAuthGuard)
  async setVendorForm(@Request() req, @Param('eventId') eventId: string, @Body('formId') formId: string) {
    const event = await this.eventFormService.setVendorForm(req.user.userId, eventId, formId);
    return { 
      message: 'Vendor form linked to event successfully', 
      event: {
        id: event.id,
        vendorFormId: event.vendorFormId
      }
    };
  }

  @Post('guest')
  @UseGuards(JwtAuthGuard)
  async setGuestForm(@Request() req, @Param('eventId') eventId: string, @Body('formId') formId: string) {
    const event = await this.eventFormService.setGuestForm(req.user.userId, eventId, formId);
    return { 
      message: 'Guest registration form linked to event successfully', 
      event: {
        id: event.id,
        guestFormId: event.guestFormId
      }
    };
  }

  @Delete('vendor')
  @UseGuards(JwtAuthGuard)
  async removeVendorForm(@Request() req, @Param('eventId') eventId: string) {
    const event = await this.eventFormService.removeVendorForm(req.user.userId, eventId);
    return { 
      message: 'Vendor form removed from event successfully',
      event: {
        id: event.id,
        vendorFormId: event.vendorFormId
      }
    };
  }

  @Delete('guest')
  @UseGuards(JwtAuthGuard)
  async removeGuestForm(@Request() req, @Param('eventId') eventId: string) {
    const event = await this.eventFormService.removeGuestForm(req.user.userId, eventId);
    return { 
      message: 'Guest registration form removed from event successfully',
      event: {
        id: event.id,
        guestFormId: event.guestFormId
      }
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getEventForms(@Request() req, @Param('eventId') eventId: string) {
    const forms = await this.eventFormService.getEventForms(req.user.userId, eventId);
    return { 
      message: 'Event forms retrieved successfully', 
      forms
    };
  }
}

@Controller('events/:eventId/public-forms')
export class PublicEventFormController {
  constructor(private readonly eventFormService: EventFormService) {}

  @Get()
  async getPublicEventForms(@Param('eventId') eventId: string) {
    const forms = await this.eventFormService.getPublicEventForms(eventId);
    return { 
      message: 'Public event forms retrieved successfully', 
      forms: {
        vendorFormId: forms.vendorFormId,
        guestFormId: forms.guestFormId,
        vendorFormUrl: forms.vendorFormId ? `https://app.cleyverse.com/forms/${forms.vendorFormId}` : null,
        guestFormUrl: forms.guestFormId ? `https://app.cleyverse.com/forms/${forms.guestFormId}` : null
      }
    };
  }
}
