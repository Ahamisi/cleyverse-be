import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto, UpdateEventStatusDto, SearchEventsDto } from '../dto/event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(req.user.userId, createEventDto);
    return { message: 'Event created successfully', event };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('includeArchived') includeArchived?: boolean) {
    const events = await this.eventService.getUserEvents(req.user.userId, includeArchived === true);
    return { message: 'Events retrieved successfully', events, total: events.length };
  }

  @Get('search')
  async searchPublic(@Query() searchDto: SearchEventsDto) {
    const result = await this.eventService.searchEvents(searchDto);
    return { message: 'Events searched successfully', ...result };
  }

  @Get('slug-available/:slug')
  async checkSlugAvailability(@Param('slug') slug: string) {
    const available = await this.eventService.checkSlugAvailability(slug);
    return { message: 'Slug availability checked', available };
  }

  @Get('generate-slug')
  async generateSlug(@Query('title') title: string) {
    if (!title) {
      return { message: 'Title is required', slug: null };
    }
    const slug = await this.eventService.generateSlug(title);
    return { message: 'Slug generated successfully', slug };
  }

  @Get('public/:slug')
  async getPublicEvent(@Param('slug') slug: string) {
    const event = await this.eventService.getPublicEvent(slug);
    return { message: 'Event retrieved successfully', event };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    const event = await this.eventService.getEventById(req.user.userId, id);
    return { message: 'Event retrieved successfully', event };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const event = await this.eventService.updateEvent(req.user.userId, id, updateEventDto);
    return { message: 'Event updated successfully', event };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Request() req, @Param('id') id: string, @Body() updateStatusDto: UpdateEventStatusDto) {
    const event = await this.eventService.updateEventStatus(req.user.userId, id, updateStatusDto);
    return { message: 'Event status updated successfully', event };
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  async duplicate(@Request() req, @Param('id') id: string) {
    const event = await this.eventService.duplicateEvent(req.user.userId, id);
    return { message: 'Event duplicated successfully', event };
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req, @Param('id') id: string) {
    const analytics = await this.eventService.getEventAnalytics(req.user.userId, id);
    return { message: 'Event analytics retrieved successfully', analytics };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    await this.eventService.deleteEvent(req.user.userId, id);
    return { message: 'Event deleted successfully' };
  }
}
