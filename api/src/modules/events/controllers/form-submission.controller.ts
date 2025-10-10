import { Controller, Get, Post, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FormSubmissionHandlerService } from '../services/form-submission-handler.service';

@Controller('events/:eventId/form-submissions')
export class FormSubmissionController {
  constructor(private readonly formSubmissionHandler: FormSubmissionHandlerService) {}

  @Get('vendors')
  @UseGuards(JwtAuthGuard)
  async getVendorApplicationsFromForms(@Request() req, @Param('eventId') eventId: string) {
    const applications = await this.formSubmissionHandler.getVendorApplicationsFromForms(req.user.userId, eventId);
    return { 
      message: 'Vendor applications retrieved successfully', 
      applications,
      total: applications.length
    };
  }

  @Get('guests')
  @UseGuards(JwtAuthGuard)
  async getGuestRegistrationsFromForms(@Request() req, @Param('eventId') eventId: string) {
    const registrations = await this.formSubmissionHandler.getGuestRegistrationsFromForms(req.user.userId, eventId);
    return { 
      message: 'Guest registrations retrieved successfully', 
      registrations,
      total: registrations.length
    };
  }

  @Post('vendors/:submissionId/approve')
  @UseGuards(JwtAuthGuard)
  async approveVendorFromForm(
    @Request() req, 
    @Param('eventId') eventId: string, 
    @Param('submissionId') submissionId: string,
    @Body() approvalData: {
      boothNumber?: string;
      boothLocation?: string;
      vendorFee?: number;
      commissionRate?: number;
      reviewNotes?: string;
    }
  ) {
    const vendor = await this.formSubmissionHandler.approveVendorFromForm(req.user.userId, eventId, submissionId, approvalData);
    return { 
      message: 'Vendor approved successfully', 
      vendor
    };
  }

  @Post('vendors/:submissionId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectVendorFromForm(
    @Request() req, 
    @Param('eventId') eventId: string, 
    @Param('submissionId') submissionId: string,
    @Body() rejectionData: {
      reviewNotes?: string;
      rejectionReason?: string;
    }
  ) {
    // TODO: Implement rejection logic
    return { 
      message: 'Vendor rejected successfully'
    };
  }
}

// Webhook endpoint for Forms Module to notify Events Module
@Controller('webhooks/forms')
export class FormsWebhookController {
  constructor(private readonly formSubmissionHandler: FormSubmissionHandlerService) {}

  @Post('submission-created')
  async handleFormSubmission(@Body() payload: {
    formId: string;
    submissionId: string;
    userId?: string;
    submissionData: any;
  }) {
    try {
      // Get form to determine purpose
      // If it's a vendor form, create vendor application
      // If it's a guest form, create guest registration
      
      // This would be called automatically when someone submits a form
      // linked to an event
      
      return { message: 'Form submission processed successfully' };
    } catch (error) {
      console.error('Error processing form submission:', error);
      return { message: 'Error processing form submission', error: error.message };
    }
  }
}
