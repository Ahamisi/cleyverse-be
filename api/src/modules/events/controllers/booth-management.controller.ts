import { Controller, Get, Post, Put, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { BoothManagementService, CreateBoothDto, BulkCreateBoothsDto } from '../services/booth-management.service';

@Controller('events/:eventId/booths')
export class BoothManagementController {
  constructor(private readonly boothService: BoothManagementService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooth(@Request() req, @Param('eventId') eventId: string, @Body() createBoothDto: CreateBoothDto) {
    const booth = await this.boothService.createBooth(req.user.userId, eventId, createBoothDto);
    return { message: 'Booth created successfully', booth };
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  async bulkCreateBooths(@Request() req, @Param('eventId') eventId: string, @Body() bulkCreateDto: BulkCreateBoothsDto) {
    const booths = await this.boothService.bulkCreateBooths(req.user.userId, eventId, bulkCreateDto);
    return { 
      message: 'Booths created successfully', 
      booths, 
      total: booths.length,
      boothNumbers: booths.map(b => b.boothNumber)
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getEventBooths(@Request() req, @Param('eventId') eventId: string) {
    const booths = await this.boothService.getEventBooths(req.user.userId, eventId);
    return { message: 'Event booths retrieved successfully', booths, total: booths.length };
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  async getAvailableBooths(@Request() req, @Param('eventId') eventId: string) {
    const booths = await this.boothService.getAvailableBooths(req.user.userId, eventId);
    return { message: 'Available booths retrieved successfully', booths, total: booths.length };
  }

  @Get('suggestions')
  @UseGuards(JwtAuthGuard)
  async getBoothSuggestions(
    @Request() req, 
    @Param('eventId') eventId: string,
    @Query('preferredSection') preferredSection?: string,
    @Query('needsPower') needsPower?: string,
    @Query('needsWifi') needsWifi?: string,
    @Query('needsStorage') needsStorage?: string,
    @Query('needsSink') needsSink?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    const requirements = {
      preferredSection,
      needsPower: needsPower === 'true',
      needsWifi: needsWifi === 'true',
      needsStorage: needsStorage === 'true',
      needsSink: needsSink === 'true',
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    };

    const booths = await this.boothService.generateBoothSuggestion(eventId, requirements);
    return { 
      message: 'Booth suggestions retrieved successfully', 
      suggestions: booths, 
      total: booths.length,
      criteria: requirements
    };
  }

  @Put(':boothId/assign/:vendorId')
  @UseGuards(JwtAuthGuard)
  async assignBoothToVendor(
    @Request() req, 
    @Param('eventId') eventId: string, 
    @Param('boothId') boothId: string,
    @Param('vendorId') vendorId: string
  ) {
    const booth = await this.boothService.assignBoothToVendor(req.user.userId, eventId, boothId, vendorId);
    return { message: 'Booth assigned to vendor successfully', booth };
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getBoothAnalytics(@Request() req, @Param('eventId') eventId: string) {
    const analytics = await this.boothService.getBoothAnalytics(req.user.userId, eventId);
    return { message: 'Booth analytics retrieved successfully', analytics };
  }
}
