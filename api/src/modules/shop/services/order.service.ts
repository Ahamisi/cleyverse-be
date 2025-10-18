import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus, OrderType } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product, ProductStatus } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Store } from '../entities/store.entity';
import { PaymentService } from '../../payments/services/payment.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto, GuestOrderQueryDto } from '../dto/order.dto';
import { PaymentType, PaymentMethod, PlatformType } from '../../payments/entities/payment.entity';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(storeId: string, createOrderDto: CreateOrderDto, userId?: string): Promise<{
    order: Order;
    paymentUrl?: string;
    accessCode?: string;
    reference?: string;
  }> {
    // Validate store exists and is active
    // Handle both UUID and store URL
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
    
    let store;
    if (isUUID) {
      // If it's a UUID, search by ID
      store = await this.storeRepository.findOne({
        where: { id: storeId, isActive: true }
      });
    } else {
      // If it's not a UUID, search by store URL
      store = await this.storeRepository.findOne({
        where: { storeUrl: storeId, isActive: true }
      });
    }

    if (!store) {
      throw new NotFoundException('Store not found or not active');
    }

    // Validate products and variants
    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
        storeId: store.id, // Use the actual store UUID
        status: ProductStatus.ACTIVE,
        isPublished: true
      },
      relations: ['variants', 'images']
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or not available');
    }

    // Validate variants and inventory
    const variantIds = createOrderDto.items
      .filter(item => item.variantId)
      .map(item => item.variantId);

    let variants: ProductVariant[] = [];
    if (variantIds.length > 0) {
      variants = await this.productVariantRepository.find({
        where: { id: In(variantIds) }
      });
    }

    // Calculate totals and validate inventory
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      let variant: ProductVariant | undefined;
      let unitPrice = product.price;

      if (item.variantId) {
        variant = variants.find(v => v.id === item.variantId);
        if (!variant) {
          throw new BadRequestException(`Variant ${item.variantId} not found`);
        }
        unitPrice = variant.price;
      }

      // Check inventory
      const availableInventory = variant ? variant.inventoryQuantity : product.inventoryQuantity;
      if (availableInventory < item.quantity) {
        throw new BadRequestException(`Insufficient inventory for ${product.title}`);
      }

      const totalPrice = (unitPrice || 0) * item.quantity;
      subtotal += totalPrice;

      // Create order item snapshot
      orderItems.push({
        productId: product.id,
        variantId: variant?.id,
        productTitle: product.title,
        variantTitle: variant?.title,
        productHandle: product.handle,
        productImage: product.images?.[0]?.imageUrl,
        quantity: item.quantity,
        unitPrice: unitPrice || 0,
        totalPrice,
        currency: store.currency,
        productSnapshot: {
          title: product.title,
          description: product.description || '',
          price: product.price || 0,
          compareAtPrice: product.compareAtPrice || undefined,
          sku: undefined, // SKU not available in current Product schema
          weight: product.weight || undefined,
          dimensions: undefined, // Not available in current schema
          tags: product.tags || [],
          category: product.productCategory || ''
        },
        variantSnapshot: variant ? {
          title: variant.title,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || undefined,
          sku: variant.sku || undefined,
          weight: variant.weight || undefined,
          inventory: variant.inventoryQuantity,
          options: {
            option1: variant.option1Value || '',
            option2: variant.option2Value || '',
            option3: variant.option3Value || ''
          }
        } : undefined
      });
    }

    // Calculate totals
    const shippingCost = 0; // TODO: Implement shipping calculation
    const taxAmount = 0; // TODO: Implement tax calculation
    const discountAmount = 0; // TODO: Implement discount calculation
    const total = subtotal + shippingCost + taxAmount - discountAmount;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = this.orderRepository.create({
      userId: userId || null,
      storeId: store.id, // Use the actual store UUID
      orderNumber,
      status: OrderStatus.PENDING,
      type: userId ? OrderType.REGISTERED : OrderType.GUEST,
      customerEmail: createOrderDto.customer.email,
      customerFirstName: createOrderDto.customer.firstName,
      customerLastName: createOrderDto.customer.lastName,
      customerPhone: createOrderDto.customer.phone,
      shippingAddress: createOrderDto.shippingAddress?.address,
      shippingCity: createOrderDto.shippingAddress?.city,
      shippingState: createOrderDto.shippingAddress?.state,
      shippingPostalCode: createOrderDto.shippingAddress?.postalCode,
      shippingCountry: createOrderDto.shippingAddress?.country,
      billingAddress: createOrderDto.billingAddress?.address || createOrderDto.shippingAddress?.address,
      billingCity: createOrderDto.billingAddress?.city || createOrderDto.shippingAddress?.city,
      billingState: createOrderDto.billingAddress?.state || createOrderDto.shippingAddress?.state,
      billingPostalCode: createOrderDto.billingAddress?.postalCode || createOrderDto.shippingAddress?.postalCode,
      billingCountry: createOrderDto.billingAddress?.country || createOrderDto.shippingAddress?.country,
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      total,
      currency: store.currency,
      customerNotes: createOrderDto.customerNotes,
      metadata: {
        discountCode: createOrderDto.discountCode,
        useShippingAsBilling: createOrderDto.useShippingAsBilling
      }
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const savedOrderItems = await Promise.all(
      orderItems.map(item => {
        const orderItem = this.orderItemRepository.create({
          ...item,
          orderId: savedOrder.id
        });
        return this.orderItemRepository.save(orderItem);
      })
    );

    // Update inventory
    await this.updateInventory(orderItems);

    // Determine the best currency based on customer location and store support
    const customerCountry = createOrderDto.billingAddress?.country || 'US';
    const finalCurrency = this.detectBestCurrency(store.currency, customerCountry);

    // Create payment
    const paymentResult = await this.paymentService.createPayment({
      userId: userId || null, // Use null for guest users
      amount: total,
      currency: finalCurrency,
      type: PaymentType.ONE_TIME,
      method: PaymentMethod.CREDIT_CARD,
      platform: PlatformType.CLEY_BIZ,
      description: `Order ${orderNumber} - ${store.name}`,
      metadata: {
        orderId: savedOrder.id,
        orderNumber: orderNumber,
        storeId: store.id,
        storeName: store.name,
        customerEmail: createOrderDto.customer.email,
        items: orderItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      },
      customerEmail: createOrderDto.customer.email,
      callbackUrl: `${process.env.BASE_URL}/orders/${savedOrder.id}/payment-callback`
    });

    // Update order with payment reference
    await this.orderRepository.update(savedOrder.id, {
      paymentId: paymentResult.payment.id,
      paymentStatus: paymentResult.payment.status
    });

    return {
      order: { ...savedOrder, items: savedOrderItems },
      paymentUrl: paymentResult.authorizationUrl,
      accessCode: paymentResult.accessCode,
      reference: paymentResult.reference
    };
  }

  async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'items.variant', 'store', 'payment']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access permissions
    if (order.type === OrderType.REGISTERED && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string, email: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber, customerEmail: email },
      relations: ['items', 'items.product', 'items.variant', 'store', 'payment']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: string, query: OrderQueryDto): Promise<{
    orders: Order[];
    total: number;
  }> {
    const where: any = { userId };
    
    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['items', 'store'],
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.offset
    });

    return { orders, total };
  }

  async getStoreOrders(storeId: string, query: OrderQueryDto): Promise<{
    orders: Order[];
    total: number;
  }> {
    // Handle both UUID and store URL
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
    
    let actualStoreId: string;
    if (isUUID) {
      actualStoreId = storeId;
    } else {
      // Find store by URL to get the actual UUID
      const store = await this.storeRepository.findOne({
        where: { storeUrl: storeId, isActive: true }
      });
      if (!store) {
        throw new NotFoundException('Store not found');
      }
      actualStoreId = store.id;
    }

    const where: any = { storeId: actualStoreId };
    
    if (query.status) {
      where.status = query.status;
    }

    if (query.customerEmail) {
      where.customerEmail = query.customerEmail;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.offset
    });

    return { orders, total };
  }

  async updateOrderStatus(orderId: string, updateDto: UpdateOrderStatusDto, userId?: string): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);

    // Update order status
    await this.orderRepository.update(orderId, {
      status: updateDto.status,
      trackingNumber: updateDto.trackingNumber,
      carrier: updateDto.carrier,
      internalNotes: updateDto.notes,
      shippedAt: updateDto.status === OrderStatus.SHIPPED ? new Date() : order.shippedAt,
      deliveredAt: updateDto.status === OrderStatus.DELIVERED ? new Date() : order.deliveredAt,
      cancelledAt: updateDto.status === OrderStatus.CANCELLED ? new Date() : order.cancelledAt
    });

    return await this.getOrderById(orderId, userId);
  }

  async cancelOrder(orderId: string, reason: string, userId?: string): Promise<Order> {
    const order = await this.getOrderById(orderId, userId);

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel shipped or delivered orders');
    }

    await this.orderRepository.update(orderId, {
      status: OrderStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date()
    });

    // Restore inventory
    await this.restoreInventory(order.items);

    return await this.getOrderById(orderId, userId);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  private detectBestCurrency(storeCurrency: string, customerCountry: string): string {
    // Country to currency mapping
    const countryCurrencyMap: Record<string, string> = {
      'NG': 'NGN', // Nigeria
      'GH': 'GHS', // Ghana
      'KE': 'KES', // Kenya
      'ZA': 'ZAR', // South Africa
      'UG': 'UGX', // Uganda
      'TZ': 'TZS', // Tanzania
      'ZM': 'ZMW', // Zambia
      'RW': 'RWF', // Rwanda
      'US': 'USD', // United States
      'GB': 'GBP', // United Kingdom
      'CA': 'CAD', // Canada
      'AU': 'AUD', // Australia
      'EU': 'EUR', // European Union
      'JP': 'JPY', // Japan
    };

    // Get customer's local currency
    const customerCurrency = countryCurrencyMap[customerCountry.toUpperCase()] || 'USD';

    // If store supports the customer's currency, use it
    // Otherwise, fall back to store's default currency
    const supportedCurrencies = ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'ZMW', 'RWF', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
    
    if (supportedCurrencies.includes(customerCurrency)) {
      return customerCurrency;
    }

    return storeCurrency;
  }

  async getStoreById(storeId: string, userId: string): Promise<any> {
    // Handle both UUID and store URL
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
    
    let store;
    if (isUUID) {
      // If it's a UUID, search by ID
      store = await this.storeRepository.findOne({
        where: { id: storeId, userId }
      });
    } else {
      // If it's not a UUID, search by store URL
      store = await this.storeRepository.findOne({
        where: { storeUrl: storeId, userId }
      });
    }

    return store;
  }

  private async updateInventory(orderItems: Partial<OrderItem>[]): Promise<void> {
    for (const item of orderItems) {
      if (item.variantId) {
        await this.productVariantRepository.decrement(
          { id: item.variantId },
          'inventoryQuantity',
          item.quantity || 0
        );
      } else {
        await this.productRepository.decrement(
          { id: item.productId },
          'inventoryQuantity',
          item.quantity || 0
        );
      }
    }
  }

  private async restoreInventory(orderItems: OrderItem[]): Promise<void> {
    for (const item of orderItems) {
      if (item.variantId) {
        await this.productVariantRepository.increment(
          { id: item.variantId },
          'inventoryQuantity',
          item.quantity || 0
        );
      } else {
        await this.productRepository.increment(
          { id: item.productId },
          'inventoryQuantity',
          item.quantity || 0
        );
      }
    }
  }
}
