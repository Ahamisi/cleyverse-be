import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { VendorService } from '../services/vendor.service';
import { ApplyAsVendorDto, UpdateVendorApplicationDto, ReviewVendorApplicationDto, UpdateVendorBoothDto, LinkProductToEventDto, SearchVendorsDto } from '../dto/vendor.dto';

@Controller('events/:eventId/vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async apply(@Request() req, @Param('eventId') eventId: string, @Body() applyDto: ApplyAsVendorDto) {
    const vendor = await this.vendorService.applyAsVendor(req.user.userId, eventId, applyDto);
    return { message: 'Vendor application submitted successfully', vendor };
  }

  @Get('my-application')
  @UseGuards(JwtAuthGuard)
  async getMyApplication(@Request() req, @Param('eventId') eventId: string) {
    const vendor = await this.vendorService.getVendorApplication(req.user.userId, eventId);
    return { message: 'Vendor application retrieved successfully', vendor };
  }

  @Put('my-application')
  @UseGuards(JwtAuthGuard)
  async updateMyApplication(@Request() req, @Param('eventId') eventId: string, @Body() updateDto: UpdateVendorApplicationDto) {
    const vendor = await this.vendorService.updateVendorApplication(req.user.userId, eventId, updateDto);
    return { message: 'Vendor application updated successfully', vendor };
  }

  @Delete('my-application')
  @UseGuards(JwtAuthGuard)
  async cancelMyApplication(@Request() req, @Param('eventId') eventId: string) {
    await this.vendorService.cancelVendorApplication(req.user.userId, eventId);
    return { message: 'Vendor application cancelled successfully' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Param('eventId') eventId: string, @Query() searchDto: SearchVendorsDto) {
    const vendors = await this.vendorService.getEventVendors(req.user.userId, eventId, searchDto);
    return { message: 'Vendors retrieved successfully', vendors, total: vendors.length };
  }

  @Get('public')
  async getPublicVendors(@Param('eventId') eventId: string) {
    const vendors = await this.vendorService.getPublicEventVendors(eventId);
    return { message: 'Public vendors retrieved successfully', vendors, total: vendors.length };
  }

  @Put(':vendorId/review')
  @UseGuards(JwtAuthGuard)
  async reviewApplication(@Request() req, @Param('eventId') eventId: string, @Param('vendorId') vendorId: string, @Body() reviewDto: ReviewVendorApplicationDto) {
    const vendor = await this.vendorService.reviewVendorApplication(req.user.userId, eventId, vendorId, reviewDto);
    return { message: 'Vendor application reviewed successfully', vendor };
  }

  @Put(':vendorId/booth')
  @UseGuards(JwtAuthGuard)
  async updateBooth(@Request() req, @Param('eventId') eventId: string, @Param('vendorId') vendorId: string, @Body() updateBoothDto: UpdateVendorBoothDto) {
    const vendor = await this.vendorService.updateVendorBooth(req.user.userId, eventId, vendorId, updateBoothDto);
    return { message: 'Vendor booth updated successfully', vendor };
  }

  @Get(':vendorId/analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics(@Request() req, @Param('eventId') eventId: string, @Param('vendorId') vendorId: string) {
    const analytics = await this.vendorService.getVendorAnalytics(req.user.userId, eventId, vendorId);
    return { message: 'Vendor analytics retrieved successfully', analytics };
  }
}

@Controller('events/:eventId/products')
export class EventProductController {
  constructor(private readonly vendorService: VendorService) {}

  @Post('link')
  @UseGuards(JwtAuthGuard)
  async linkProduct(@Request() req, @Param('eventId') eventId: string, @Body() linkDto: LinkProductToEventDto) {
    const eventProduct = await this.vendorService.linkProductToEvent(req.user.userId, eventId, linkDto);
    return { message: 'Product linked to event successfully', eventProduct };
  }

  @Get()
  async getEventProducts(@Param('eventId') eventId: string, @Query('vendorId') vendorId?: string) {
    const products = await this.vendorService.getEventProducts(eventId, vendorId);
    return { message: 'Event products retrieved successfully', products, total: products.length };
  }

  @Put(':productId/approve')
  @UseGuards(JwtAuthGuard)
  async approveProduct(@Request() req, @Param('eventId') eventId: string, @Param('productId') productId: string) {
    const eventProduct = await this.vendorService.approveEventProduct(req.user.userId, eventId, productId);
    return { message: 'Product approved successfully', eventProduct };
  }

  @Put(':productId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectProduct(@Request() req, @Param('eventId') eventId: string, @Param('productId') productId: string, @Body('reason') reason: string) {
    const eventProduct = await this.vendorService.rejectEventProduct(req.user.userId, eventId, productId, reason);
    return { message: 'Product rejected successfully', eventProduct };
  }
}
