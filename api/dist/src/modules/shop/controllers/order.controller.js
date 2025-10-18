"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrderController = exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const order_service_1 = require("../services/order.service");
const order_dto_1 = require("../dto/order.dto");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(storeId, createOrderDto) {
        const result = await this.orderService.createOrder(storeId, createOrderDto);
        return {
            message: 'Order created successfully',
            order: result.order,
            payment: {
                authorizationUrl: result.paymentUrl,
                accessCode: result.accessCode,
                reference: result.reference
            }
        };
    }
    async createAuthenticatedOrder(req, storeId, createOrderDto) {
        const userId = req.user.id;
        const result = await this.orderService.createOrder(storeId, createOrderDto, userId);
        return {
            message: 'Authenticated order created successfully',
            order: result.order,
            payment: {
                authorizationUrl: result.paymentUrl,
                accessCode: result.accessCode,
                reference: result.reference
            }
        };
    }
    async getStoreOrders(storeId, query) {
        const result = await this.orderService.getStoreOrders(storeId, query);
        return {
            message: 'Store orders retrieved successfully',
            orders: result.orders,
            total: result.total
        };
    }
    async getOrderById(storeId, orderId) {
        const order = await this.orderService.getOrderById(orderId);
        return {
            message: 'Order retrieved successfully',
            order
        };
    }
    async updateOrderStatus(storeId, orderId, updateOrderStatusDto) {
        const order = await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
        return {
            message: 'Order status updated successfully',
            order
        };
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('authenticated'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createAuthenticatedOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.OrderQueryDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getStoreOrders", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)(':orderId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('stores/:storeId/orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
let UserOrderController = class UserOrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async trackOrder(query) {
        const order = await this.orderService.getOrderByNumber(query.orderNumber, query.email);
        return {
            message: 'Order retrieved successfully',
            order
        };
    }
    async getUserOrders(req, query) {
        const userId = req.user.id;
        const result = await this.orderService.getUserOrders(userId, query);
        return {
            message: 'User orders retrieved successfully',
            orders: result.orders,
            total: result.total
        };
    }
    async getUserOrderById(req, orderId) {
        const userId = req.user.id;
        const order = await this.orderService.getOrderById(orderId, userId);
        return {
            message: 'Order retrieved successfully',
            order
        };
    }
};
exports.UserOrderController = UserOrderController;
__decorate([
    (0, common_1.Get)('track'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.GuestOrderQueryDto]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "trackOrder", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.OrderQueryDto]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserOrderController.prototype, "getUserOrderById", null);
exports.UserOrderController = UserOrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], UserOrderController);
//# sourceMappingURL=order.controller.js.map