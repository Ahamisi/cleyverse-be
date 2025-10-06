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
exports.UserEventSubscription = exports.UserEventInteraction = exports.InteractionType = void 0;
const typeorm_1 = require("typeorm");
var InteractionType;
(function (InteractionType) {
    InteractionType["VIEW"] = "view";
    InteractionType["LIKE"] = "like";
    InteractionType["BOOKMARK"] = "bookmark";
    InteractionType["SHARE"] = "share";
    InteractionType["REGISTER"] = "register";
    InteractionType["ATTEND"] = "attend";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
let UserEventInteraction = class UserEventInteraction {
    id;
    createdAt;
    updatedAt;
    userId;
    eventId;
    type;
    metadata;
    sessionId;
    userAgent;
    ipAddress;
    user;
    event;
};
exports.UserEventInteraction = UserEventInteraction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEventInteraction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEventInteraction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEventInteraction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], UserEventInteraction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], UserEventInteraction.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InteractionType }),
    __metadata("design:type", String)
], UserEventInteraction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'eventInteractions'),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'userInteractions'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], UserEventInteraction.prototype, "event", void 0);
exports.UserEventInteraction = UserEventInteraction = __decorate([
    (0, typeorm_1.Entity)('user_event_interactions'),
    (0, typeorm_1.Unique)(['userId', 'eventId', 'type'])
], UserEventInteraction);
let UserEventSubscription = class UserEventSubscription {
    id;
    createdAt;
    updatedAt;
    userId;
    eventId;
    isActive;
    notifyUpdates;
    notifyReminders;
    user;
    event;
};
exports.UserEventSubscription = UserEventSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEventSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEventSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserEventSubscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], UserEventSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], UserEventSubscription.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserEventSubscription.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notify_updates', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserEventSubscription.prototype, "notifyUpdates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notify_reminders', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], UserEventSubscription.prototype, "notifyReminders", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'eventSubscriptions'),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], UserEventSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'subscriptions'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], UserEventSubscription.prototype, "event", void 0);
exports.UserEventSubscription = UserEventSubscription = __decorate([
    (0, typeorm_1.Entity)('user_event_subscriptions'),
    (0, typeorm_1.Unique)(['userId', 'eventId'])
], UserEventSubscription);
//# sourceMappingURL=user-event-interaction.entity.js.map