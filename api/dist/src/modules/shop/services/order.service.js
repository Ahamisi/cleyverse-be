"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const product_entity_1 = require("../entities/product.entity");
const product_variant_entity_1 = require("../entities/product-variant.entity");
const store_entity_1 = require("../entities/store.entity");
const payment_service_1 = require("../../payments/services/payment.service");
const payment_entity_1 = require("../../payments/entities/payment.entity");
const crypto = __importStar(require("crypto"));
let OrderService = class OrderService {
    orderRepository;
    orderItemRepository;
    productRepository;
    productVariantRepository;
    storeRepository;
    paymentService;
    constructor(orderRepository, orderItemRepository, productRepository, productVariantRepository, storeRepository, paymentService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.storeRepository = storeRepository;
        this.paymentService = paymentService;
    }
    async createOrder(storeId, createOrderDto, userId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
        let store;
        if (isUUID) {
            store = await this.storeRepository.findOne({
                where: { id: storeId, isActive: true }
            });
        }
        else {
            store = await this.storeRepository.findOne({
                where: { storeUrl: storeId, isActive: true }
            });
        }
        if (!store) {
            throw new common_1.NotFoundException('Store not found or not active');
        }
        const productIds = createOrderDto.items.map(item => item.productId);
        const products = await this.productRepository.find({
            where: {
                id: (0, typeorm_2.In)(productIds),
                storeId: store.id,
                status: product_entity_1.ProductStatus.ACTIVE,
                isPublished: true
            },
            relations: ['variants', 'images']
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products not found or not available');
        }
        const variantIds = createOrderDto.items
            .filter(item => item.variantId)
            .map(item => item.variantId);
        let variants = [];
        if (variantIds.length > 0) {
            variants = await this.productVariantRepository.find({
                where: { id: (0, typeorm_2.In)(variantIds) }
            });
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of createOrderDto.items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product ${item.productId} not found`);
            }
            let variant;
            let unitPrice = product.price;
            if (item.variantId) {
                variant = variants.find(v => v.id === item.variantId);
                if (!variant) {
                    throw new common_1.BadRequestException(`Variant ${item.variantId} not found`);
                }
                unitPrice = variant.price;
            }
            const availableInventory = variant ? variant.inventoryQuantity : product.inventoryQuantity;
            if (availableInventory < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient inventory for ${product.title}`);
            }
            const totalPrice = (unitPrice || 0) * item.quantity;
            subtotal += totalPrice;
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
                    sku: undefined,
                    weight: product.weight || undefined,
                    dimensions: undefined,
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
        const shippingCost = 0;
        const taxAmount = 0;
        const discountAmount = 0;
        const total = subtotal + shippingCost + taxAmount - discountAmount;
        const orderNumber = this.generateOrderNumber();
        const order = this.orderRepository.create({
            userId: userId || null,
            storeId: store.id,
            orderNumber,
            status: order_entity_1.OrderStatus.PENDING,
            type: userId ? order_entity_1.OrderType.REGISTERED : order_entity_1.OrderType.GUEST,
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
        const savedOrderItems = await Promise.all(orderItems.map(item => {
            const orderItem = this.orderItemRepository.create({
                ...item,
                orderId: savedOrder.id
            });
            return this.orderItemRepository.save(orderItem);
        }));
        await this.updateInventory(orderItems);
        const customerCountry = createOrderDto.billingAddress?.country || 'US';
        const finalCurrency = this.detectBestCurrency(store.currency, customerCountry);
        const paymentResult = await this.paymentService.createPayment({
            userId: userId || null,
            amount: total,
            currency: finalCurrency,
            type: payment_entity_1.PaymentType.ONE_TIME,
            method: payment_entity_1.PaymentMethod.CREDIT_CARD,
            platform: payment_entity_1.PlatformType.CLEY_BIZ,
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
    async getOrderById(orderId, userId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product', 'items.variant', 'store', 'payment']
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.type === order_entity_1.OrderType.REGISTERED && order.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    async getOrderByNumber(orderNumber, email) {
        const order = await this.orderRepository.findOne({
            where: { orderNumber, customerEmail: email },
            relations: ['items', 'items.product', 'items.variant', 'store', 'payment']
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async getUserOrders(userId, query) {
        const where = { userId };
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
    async getStoreOrders(storeId, query) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
        let actualStoreId;
        if (isUUID) {
            actualStoreId = storeId;
        }
        else {
            const store = await this.storeRepository.findOne({
                where: { storeUrl: storeId, isActive: true }
            });
            if (!store) {
                throw new common_1.NotFoundException('Store not found');
            }
            actualStoreId = store.id;
        }
        const where = { storeId: actualStoreId };
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
    async updateOrderStatus(orderId, updateDto, userId) {
        const order = await this.getOrderById(orderId, userId);
        await this.orderRepository.update(orderId, {
            status: updateDto.status,
            trackingNumber: updateDto.trackingNumber,
            carrier: updateDto.carrier,
            internalNotes: updateDto.notes,
            shippedAt: updateDto.status === order_entity_1.OrderStatus.SHIPPED ? new Date() : order.shippedAt,
            deliveredAt: updateDto.status === order_entity_1.OrderStatus.DELIVERED ? new Date() : order.deliveredAt,
            cancelledAt: updateDto.status === order_entity_1.OrderStatus.CANCELLED ? new Date() : order.cancelledAt
        });
        return await this.getOrderById(orderId, userId);
    }
    async cancelOrder(orderId, reason, userId) {
        const order = await this.getOrderById(orderId, userId);
        if (order.status === order_entity_1.OrderStatus.SHIPPED || order.status === order_entity_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Cannot cancel shipped or delivered orders');
        }
        await this.orderRepository.update(orderId, {
            status: order_entity_1.OrderStatus.CANCELLED,
            cancellationReason: reason,
            cancelledAt: new Date()
        });
        await this.restoreInventory(order.items);
        return await this.getOrderById(orderId, userId);
    }
    generateOrderNumber() {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(4).toString('hex');
        return `ORD-${timestamp}-${random}`.toUpperCase();
    }
    detectBestCurrency(storeCurrency, customerCountry) {
        const countryCurrencyMap = {
            'NG': 'NGN',
            'GH': 'GHS',
            'KE': 'KES',
            'ZA': 'ZAR',
            'UG': 'UGX',
            'TZ': 'TZS',
            'ZM': 'ZMW',
            'RW': 'RWF',
            'US': 'USD',
            'GB': 'GBP',
            'CA': 'CAD',
            'AU': 'AUD',
            'EU': 'EUR',
            'JP': 'JPY',
        };
        const customerCurrency = countryCurrencyMap[customerCountry.toUpperCase()] || 'USD';
        const supportedCurrencies = ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'ZMW', 'RWF', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
        if (supportedCurrencies.includes(customerCurrency)) {
            return customerCurrency;
        }
        return storeCurrency;
    }
    async getStoreById(storeId, userId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId);
        let store;
        if (isUUID) {
            store = await this.storeRepository.findOne({
                where: { id: storeId, userId }
            });
        }
        else {
            store = await this.storeRepository.findOne({
                where: { storeUrl: storeId, userId }
            });
        }
        return store;
    }
    async updateInventory(orderItems) {
        for (const item of orderItems) {
            if (item.variantId) {
                await this.productVariantRepository.decrement({ id: item.variantId }, 'inventoryQuantity', item.quantity || 0);
            }
            else {
                await this.productRepository.decrement({ id: item.productId }, 'inventoryQuantity', item.quantity || 0);
            }
        }
    }
    async restoreInventory(orderItems) {
        for (const item of orderItems) {
            if (item.variantId) {
                await this.productVariantRepository.increment({ id: item.variantId }, 'inventoryQuantity', item.quantity || 0);
            }
            else {
                await this.productRepository.increment({ id: item.productId }, 'inventoryQuantity', item.quantity || 0);
            }
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(4, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        payment_service_1.PaymentService])
], OrderService);
//# sourceMappingURL=order.service.js.map