import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventVendor, VendorStatus, VendorType } from '../entities/event-vendor.entity';
import { EventProduct, EventProductStatus } from '../entities/event-product.entity';
import { Event, EventStatus } from '../entities/event.entity';
import { ApplyAsVendorDto, UpdateVendorApplicationDto, ReviewVendorApplicationDto, UpdateVendorBoothDto, LinkProductToEventDto, SearchVendorsDto } from '../dto/vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(EventVendor)
    private vendorRepository: Repository<EventVendor>,
    @InjectRepository(EventProduct)
    private eventProductRepository: Repository<EventProduct>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async applyAsVendor(userId: string, eventId: string, applyDto: ApplyAsVendorDto): Promise<EventVendor> {
    // Check if event exists and allows vendors
    const event = await this.eventRepository.findOne({
      where: { id: eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.allowVendors) {
      throw new BadRequestException('This event does not allow vendors');
    }

    if (event.vendorApplicationDeadline && new Date() > event.vendorApplicationDeadline) {
      throw new BadRequestException('Vendor application deadline has passed');
    }

    if ([EventStatus.COMPLETED, EventStatus.CANCELLED, EventStatus.ARCHIVED].includes(event.status)) {
      throw new BadRequestException('Cannot apply to completed, cancelled, or archived events');
    }

    // Check if user already applied
    const existingApplication = await this.vendorRepository.findOne({
      where: { eventId, userId }
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied as a vendor for this event');
    }

    const vendor = this.vendorRepository.create({
      ...applyDto,
      eventId,
      userId,
      status: VendorStatus.APPLIED,
      appliedAt: new Date()
    });

    return this.vendorRepository.save(vendor) as unknown as EventVendor;
  }

  async updateVendorApplication(userId: string, eventId: string, updateDto: UpdateVendorApplicationDto): Promise<EventVendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { eventId, userId },
      relations: ['event']
    });

    if (!vendor) {
      throw new NotFoundException('Vendor application not found');
    }

    // Only allow updates to pending applications
    if (![VendorStatus.APPLIED, VendorStatus.UNDER_REVIEW].includes(vendor.status)) {
      throw new BadRequestException('Cannot update application after it has been reviewed');
    }

    // Check if deadline has passed
    if (vendor.event.vendorApplicationDeadline && new Date() > vendor.event.vendorApplicationDeadline) {
      throw new BadRequestException('Vendor application deadline has passed');
    }

    Object.assign(vendor, updateDto);
    return this.vendorRepository.save(vendor) as unknown as EventVendor;
  }

  async reviewVendorApplication(userId: string, eventId: string, vendorId: string, reviewDto: ReviewVendorApplicationDto): Promise<EventVendor> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId, eventId }
    });

    if (!vendor) {
      throw new NotFoundException('Vendor application not found');
    }

    if (![VendorStatus.APPLIED, VendorStatus.UNDER_REVIEW].includes(vendor.status)) {
      throw new BadRequestException('Vendor application has already been reviewed');
    }

    // Validate status
    if (![VendorStatus.APPROVED, VendorStatus.REJECTED].includes(reviewDto.status)) {
      throw new BadRequestException('Invalid review status');
    }

    vendor.status = reviewDto.status;
    vendor.reviewedAt = new Date();
    vendor.reviewedBy = userId;
    vendor.reviewNotes = reviewDto.reviewNotes || null;

    if (reviewDto.status === VendorStatus.APPROVED) {
      vendor.boothNumber = reviewDto.boothNumber || null;
      vendor.boothLocation = reviewDto.boothLocation || null;
      vendor.vendorFee = reviewDto.vendorFee || event.vendorFee;
      vendor.commissionRate = reviewDto.commissionRate || null;
    }

    return this.vendorRepository.save(vendor) as unknown as EventVendor;
  }

  async updateVendorBooth(userId: string, eventId: string, vendorId: string, updateBoothDto: UpdateVendorBoothDto): Promise<EventVendor> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId, eventId }
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new BadRequestException('Vendor must be approved to update booth details');
    }

    Object.assign(vendor, {
      ...updateBoothDto,
      setupTime: updateBoothDto.setupTime ? new Date(updateBoothDto.setupTime) : undefined,
      breakdownTime: updateBoothDto.breakdownTime ? new Date(updateBoothDto.breakdownTime) : undefined
    });

    return this.vendorRepository.save(vendor) as unknown as EventVendor;
  }

  async linkProductToEvent(userId: string, eventId: string, linkDto: LinkProductToEventDto): Promise<EventProduct> {
    // Get vendor for this event
    const vendor = await this.vendorRepository.findOne({
      where: { eventId, userId, status: VendorStatus.APPROVED }
    });

    if (!vendor) {
      throw new NotFoundException('You are not an approved vendor for this event');
    }

    // Check if product is already linked
    const existingLink = await this.eventProductRepository.findOne({
      where: { eventId, productId: linkDto.productId }
    });

    if (existingLink) {
      throw new ConflictException('Product is already linked to this event');
    }

    // TODO: Verify product belongs to user and is from their store
    // This would require importing Product entity and checking ownership

    const eventProduct = this.eventProductRepository.create({
      ...linkDto,
      eventId,
      vendorId: vendor.id,
      status: EventProductStatus.PENDING // Requires approval
    });

    return this.eventProductRepository.save(eventProduct) as unknown as EventProduct;
  }

  async approveEventProduct(userId: string, eventId: string, productId: string): Promise<EventProduct> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const eventProduct = await this.eventProductRepository.findOne({
      where: { id: productId, eventId }
    });

    if (!eventProduct) {
      throw new NotFoundException('Event product not found');
    }

    eventProduct.status = EventProductStatus.APPROVED;
    eventProduct.approvedBy = userId;
    eventProduct.approvedAt = new Date();

    return this.eventProductRepository.save(eventProduct) as unknown as EventProduct;
  }

  async rejectEventProduct(userId: string, eventId: string, productId: string, reason: string): Promise<EventProduct> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const eventProduct = await this.eventProductRepository.findOne({
      where: { id: productId, eventId }
    });

    if (!eventProduct) {
      throw new NotFoundException('Event product not found');
    }

    eventProduct.status = EventProductStatus.REJECTED;
    eventProduct.rejectionReason = reason;

    return this.eventProductRepository.save(eventProduct) as unknown as EventProduct;
  }

  async getEventVendors(userId: string, eventId: string, searchDto?: SearchVendorsDto): Promise<EventVendor[]> {
    // Verify event belongs to user
    const event = await this.eventRepository.findOne({
      where: { id: eventId, creatorId: userId }
    });

    if (!event) {
      throw new NotFoundException('Event not found or does not belong to user');
    }

    const queryBuilder = this.vendorRepository.createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .leftJoinAndSelect('vendor.store', 'store')
      .where('vendor.eventId = :eventId', { eventId });

    if (searchDto) {
      // Search filter
      if (searchDto.search) {
        queryBuilder.andWhere(
          '(vendor.businessName ILIKE :search OR vendor.contactName ILIKE :search OR vendor.contactEmail ILIKE :search)',
          { search: `%${searchDto.search}%` }
        );
      }

      // Status filter
      if (searchDto.status) {
        queryBuilder.andWhere('vendor.status = :status', { status: searchDto.status });
      }

      // Vendor type filter
      if (searchDto.vendorType) {
        queryBuilder.andWhere('vendor.vendorType = :vendorType', { vendorType: searchDto.vendorType });
      }

      // Featured filter
      if (searchDto.isFeatured !== undefined) {
        queryBuilder.andWhere('vendor.isFeatured = :isFeatured', { isFeatured: searchDto.isFeatured });
      }

      // Sorting
      queryBuilder.orderBy(`vendor.${searchDto.sortBy}`, searchDto.sortOrder);
    } else {
      queryBuilder.orderBy('vendor.displayOrder', 'ASC').addOrderBy('vendor.createdAt', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async getPublicEventVendors(eventId: string): Promise<EventVendor[]> {
    return this.vendorRepository.find({
      where: { 
        eventId, 
        status: VendorStatus.APPROVED,
        isActive: true
      },
      relations: ['user', 'store'],
      order: { 
        isFeatured: 'DESC',
        displayOrder: 'ASC',
        businessName: 'ASC'
      }
    });
  }

  async getEventProducts(eventId: string, vendorId?: string): Promise<EventProduct[]> {
    const whereClause: any = { 
      eventId,
      status: EventProductStatus.APPROVED
    };

    if (vendorId) {
      whereClause.vendorId = vendorId;
    }

    return this.eventProductRepository.find({
      where: whereClause,
      relations: ['product', 'vendor'],
      order: {
        isFeatured: 'DESC',
        displayOrder: 'ASC'
      }
    });
  }

  async getVendorApplication(userId: string, eventId: string): Promise<EventVendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { eventId, userId },
      relations: ['event', 'store']
    });

    if (!vendor) {
      throw new NotFoundException('Vendor application not found');
    }

    return vendor;
  }

  async cancelVendorApplication(userId: string, eventId: string): Promise<void> {
    const vendor = await this.vendorRepository.findOne({
      where: { eventId, userId }
    });

    if (!vendor) {
      throw new NotFoundException('Vendor application not found');
    }

    if (vendor.status === VendorStatus.APPROVED) {
      throw new BadRequestException('Cannot cancel approved vendor application. Contact event organizer.');
    }

    vendor.status = VendorStatus.CANCELLED;
    await this.vendorRepository.save(vendor);
  }

  async getVendorAnalytics(userId: string, eventId: string, vendorId: string): Promise<any> {
    // Verify vendor belongs to user or user owns event
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId, eventId },
      relations: ['event']
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.userId !== userId && vendor.event.creatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Get product statistics
    const productStats = await this.eventProductRepository
      .createQueryBuilder('eventProduct')
      .select([
        'COUNT(*) as totalProducts',
        'COUNT(CASE WHEN eventProduct.status = \'approved\' THEN 1 END) as approvedProducts',
        'SUM(eventProduct.viewCount) as totalViews',
        'SUM(eventProduct.ordersCount) as totalOrders',
        'SUM(eventProduct.totalRevenue) as totalRevenue'
      ])
      .where('eventProduct.vendorId = :vendorId', { vendorId })
      .getRawOne();

    return {
      vendor: {
        id: vendor.id,
        businessName: vendor.businessName,
        status: vendor.status,
        boothNumber: vendor.boothNumber,
        totalSales: vendor.totalSales,
        totalOrders: vendor.totalOrders,
        boothVisits: vendor.boothVisits
      },
      products: {
        total: parseInt(productStats.totalProducts) || 0,
        approved: parseInt(productStats.approvedProducts) || 0,
        totalViews: parseInt(productStats.totalViews) || 0,
        totalOrders: parseInt(productStats.totalOrders) || 0,
        totalRevenue: parseFloat(productStats.totalRevenue) || 0
      }
    };
  }
}
