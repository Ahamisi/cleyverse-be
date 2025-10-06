import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GuestService } from '../services/guest.service';
import { InviteGuestDto, BulkInviteGuestsDto, ImportGuestsDto, UpdateGuestStatusDto, CheckInGuestDto, RegisterGuestDto, SearchGuestsDto } from '../dto/guest.dto';

@Controller('events/:eventId/guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  async inviteGuest(@Request() req, @Param('eventId') eventId: string, @Body() inviteDto: InviteGuestDto) {
    const guest = await this.guestService.inviteGuest(req.user.userId, eventId, inviteDto);
    return { message: 'Guest invited successfully', guest };
  }

  @Post('bulk-invite')
  @UseGuards(JwtAuthGuard)
  async bulkInviteGuests(@Request() req, @Param('eventId') eventId: string, @Body() bulkInviteDto: BulkInviteGuestsDto) {
    const result = await this.guestService.bulkInviteGuests(req.user.userId, eventId, bulkInviteDto);
    return { 
      message: 'Bulk invitation completed', 
      invited: result.invited.length,
      errors: result.errors.length,
      details: result
    };
  }

  @Post('import-emails')
  @UseGuards(JwtAuthGuard)
  async importGuests(@Request() req, @Param('eventId') eventId: string, @Body() importDto: ImportGuestsDto) {
    const result = await this.guestService.importGuestsFromEmails(req.user.userId, eventId, importDto);
    return { 
      message: 'Email import completed', 
      invited: result.invited.length,
      errors: result.errors.length,
      details: result
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Param('eventId') eventId: string, @Query() searchDto: SearchGuestsDto) {
    const guests = await this.guestService.getEventGuests(req.user.userId, eventId, searchDto);
    return { message: 'Guests retrieved successfully', guests, total: guests.length };
  }

  @Put(':guestId/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Request() req, @Param('eventId') eventId: string, @Param('guestId') guestId: string, @Body() updateStatusDto: UpdateGuestStatusDto) {
    const guest = await this.guestService.updateGuestStatus(req.user.userId, eventId, guestId, updateStatusDto);
    return { message: 'Guest status updated successfully', guest };
  }

  @Put(':guestId/check-in')
  @UseGuards(JwtAuthGuard)
  async checkIn(@Request() req, @Param('eventId') eventId: string, @Param('guestId') guestId: string, @Body() checkInDto: CheckInGuestDto) {
    const guest = await this.guestService.checkInGuest(req.user.userId, eventId, guestId, checkInDto);
    return { message: 'Guest checked in successfully', guest };
  }

  @Post('search-for-checkin')
  @UseGuards(JwtAuthGuard)
  async searchForCheckIn(@Request() req, @Param('eventId') eventId: string, @Body('search') search: string) {
    const guests = await this.guestService.searchGuestsForCheckIn(req.user.userId, eventId, search);
    return { message: 'Guests found for check-in', guests, total: guests.length };
  }

  @Put(':guestId/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmGuest(@Request() req, @Param('eventId') eventId: string, @Param('guestId') guestId: string) {
    const guest = await this.guestService.confirmGuest(req.user.userId, eventId, guestId);
    return { message: 'Guest confirmed successfully', guest };
  }

  @Post('bulk-confirm')
  @UseGuards(JwtAuthGuard)
  async bulkConfirmGuests(@Request() req, @Param('eventId') eventId: string, @Body('guestIds') guestIds: string[]) {
    const result = await this.guestService.bulkConfirmGuests(req.user.userId, eventId, guestIds);
    return { 
      message: 'Bulk confirmation completed', 
      confirmed: result.confirmed,
      errors: result.errors.length,
      details: result
    };
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async exportGuestList(@Request() req, @Param('eventId') eventId: string, @Query('format') format?: 'csv' | 'xlsx') {
    const data = await this.guestService.exportGuestList(req.user.userId, eventId, format);
    return { 
      message: 'Guest list exported successfully', 
      data,
      total: data.length,
      format: format || 'csv'
    };
  }

  @Delete(':guestId')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('eventId') eventId: string, @Param('guestId') guestId: string) {
    await this.guestService.deleteGuest(req.user.userId, eventId, guestId);
    return { message: 'Guest removed successfully' };
  }
}

@Controller('guest-registration')
export class GuestRegistrationController {
  constructor(private readonly guestService: GuestService) {}

  @Get(':token')
  async getRegistrationForm(@Param('token') token: string) {
    const guest = await this.guestService.getGuestByToken(token);
    return { 
      message: 'Registration form retrieved successfully', 
      guest: {
        id: guest.id,
        guestName: guest.guestName,
        guestEmail: guest.guestEmail,
        status: guest.status
      },
      event: {
        id: guest.event.id,
        title: guest.event.title,
        startDate: guest.event.startDate,
        endDate: guest.event.endDate,
        locationType: guest.event.locationType,
        venueName: guest.event.venueName,
        venueAddress: guest.event.venueAddress,
        virtualLink: guest.event.virtualLink,
        registrationQuestions: guest.event.registrationQuestions
      }
    };
  }

  @Post(':token/register')
  async register(@Param('token') token: string, @Body() registerDto: RegisterGuestDto) {
    const guest = await this.guestService.registerGuest({ ...registerDto, registrationToken: token });
    return { message: 'Registration completed successfully', guest };
  }
}
