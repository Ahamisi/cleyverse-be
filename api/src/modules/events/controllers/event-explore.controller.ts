import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { EventRecommendationService, ExploreEventsDto } from '../services/event-recommendation.service';
import { RecurringEventService, CreateRecurringEventDto } from '../services/recurring-event.service';
import { InteractionType } from '../entities/user-event-interaction.entity';

@Controller('explore/events')
export class EventExploreController {
  constructor(
    private readonly recommendationService: EventRecommendationService,
    private readonly recurringEventService: RecurringEventService,
  ) {}

  @Get('')
  async exploreEvents(@Request() req, @Query() exploreDto: ExploreEventsDto) {
    const userId = req.user?.userId || null;
    const result = await this.recommendationService.exploreEvents(userId, exploreDto);
    
    return { 
      message: 'Events retrieved successfully', 
      events: result.events,
      total: result.total,
      page: exploreDto.page || 1,
      limit: exploreDto.limit || 20,
      totalPages: Math.ceil(result.total / (exploreDto.limit || 20))
    };
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getPersonalizedRecommendations(@Request() req, @Query('limit') limit?: number) {
    const events = await this.recommendationService.getPersonalizedRecommendations(req.user.userId, limit);
    return { 
      message: 'Personalized recommendations retrieved successfully', 
      events,
      total: events.length
    };
  }

  @Get('nearby')
  async getNearbyEvents(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number
  ) {
    const events = await this.recommendationService.getLocationBasedRecommendations(
      latitude, 
      longitude, 
      radius, 
      limit
    );
    return { 
      message: 'Nearby events retrieved successfully', 
      events,
      total: events.length
    };
  }

  @Get('trending')
  async getTrendingEvents(@Query('limit') limit?: number) {
    const events = await this.recommendationService.getTrendingEvents(limit);
    return { 
      message: 'Trending events retrieved successfully', 
      events,
      total: events.length
    };
  }

  @Get('upcoming')
  async getUpcomingEvents(@Query('limit') limit?: number) {
    const events = await this.recommendationService.getUpcomingEvents(limit);
    return { 
      message: 'Upcoming events retrieved successfully', 
      events,
      total: events.length
    };
  }

  @Post(':eventId/interact')
  @UseGuards(JwtAuthGuard)
  async trackInteraction(
    @Request() req, 
    @Param('eventId') eventId: string, 
    @Body() body: { type: InteractionType; metadata?: any }
  ) {
    await this.recommendationService.trackInteraction(req.user.userId, eventId, body.type, body.metadata);
    return { message: 'Interaction tracked successfully' };
  }

  @Post(':eventId/subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribeToEvent(@Request() req, @Param('eventId') eventId: string) {
    const subscription = await this.recommendationService.subscribeToEvent(req.user.userId, eventId);
    return { message: 'Subscribed to event successfully', subscription };
  }

  @Delete(':eventId/subscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribeFromEvent(@Request() req, @Param('eventId') eventId: string) {
    await this.recommendationService.unsubscribeFromEvent(req.user.userId, eventId);
    return { message: 'Unsubscribed from event successfully' };
  }
}

@Controller('events/:eventId/recurring')
export class RecurringEventController {
  constructor(private readonly recurringEventService: RecurringEventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRecurringEvent(@Request() req, @Param('eventId') eventId: string, @Body() recurringDto: CreateRecurringEventDto) {
    const events = await this.recurringEventService.createRecurringEvent(req.user.userId, eventId, recurringDto);
    return { 
      message: 'Recurring event series created successfully', 
      parentEvent: events[0],
      instances: events.slice(1),
      totalInstances: events.length - 1
    };
  }

  @Get('instances')
  @UseGuards(JwtAuthGuard)
  async getRecurringInstances(@Request() req, @Param('eventId') eventId: string) {
    const instances = await this.recurringEventService.getRecurringEventInstances(req.user.userId, eventId);
    return { 
      message: 'Recurring event instances retrieved successfully', 
      instances,
      total: instances.length
    };
  }

  @Put('series')
  @UseGuards(JwtAuthGuard)
  async updateRecurringSeries(@Request() req, @Param('eventId') eventId: string, @Body() updateData: any) {
    const events = await this.recurringEventService.updateRecurringEventSeries(req.user.userId, eventId, updateData);
    return { 
      message: 'Recurring event series updated successfully', 
      parentEvent: events[0],
      instances: events.slice(1)
    };
  }

  @Delete('series')
  @UseGuards(JwtAuthGuard)
  async deleteRecurringSeries(
    @Request() req, 
    @Param('eventId') eventId: string, 
    @Query('option') deleteOption: 'all' | 'future' = 'future'
  ) {
    await this.recurringEventService.deleteRecurringEventSeries(req.user.userId, eventId, deleteOption);
    return { message: `Recurring event series (${deleteOption}) deleted successfully` };
  }

  @Post('instances/:instanceId/break')
  @UseGuards(JwtAuthGuard)
  async breakRecurringInstance(@Request() req, @Param('instanceId') instanceId: string) {
    const event = await this.recurringEventService.breakRecurringEventInstance(req.user.userId, instanceId);
    return { message: 'Event instance broken from recurring series successfully', event };
  }
}
