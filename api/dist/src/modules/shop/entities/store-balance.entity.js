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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreBalance = exports.TransactionType = exports.BalanceType = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
var BalanceType;
(function (BalanceType) {
    BalanceType["AVAILABLE"] = "available";
    BalanceType["PENDING"] = "pending";
    BalanceType["HELD"] = "held";
    BalanceType["PROCESSING"] = "processing";
})(BalanceType || (exports.BalanceType = BalanceType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["EARNING"] = "earning";
    TransactionType["PAYOUT"] = "payout";
    TransactionType["REFUND"] = "refund";
    TransactionType["ADJUSTMENT"] = "adjustment";
    TransactionType["FEE"] = "fee";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let StoreBalance = class StoreBalance {
    id;
    storeId;
    store;
    type;
    amount;
    currency;
    transactionType;
    description;
    paymentId;
    orderId;
    metadata;
    processedAt;
    createdAt;
    updatedAt;
};
exports.StoreBalance = StoreBalance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StoreBalance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StoreBalance.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'storeId' }),
    __metadata("design:type", store_entity_1.Store)
], StoreBalance.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BalanceType }),
    __metadata("design:type", String)
], StoreBalance.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], StoreBalance.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'USD' }),
    __metadata("design:type", String)
], StoreBalance.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], StoreBalance.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StoreBalance.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StoreBalance.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], StoreBalance.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], StoreBalance.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], StoreBalance.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StoreBalance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StoreBalance.prototype, "updatedAt", void 0);
exports.StoreBalance = StoreBalance = __decorate([
    (0, typeorm_1.Entity)('store_balances'),
    (0, typeorm_1.Index)(['storeId', 'type']),
    (0, typeorm_1.Index)(['storeId', 'createdAt'])
], StoreBalance);
//# sourceMappingURL=store-balance.entity.js.map