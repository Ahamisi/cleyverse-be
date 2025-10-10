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
exports.EventGuest = exports.InvitationSource = exports.GuestType = exports.GuestStatus = void 0;
const typeorm_1 = require("typeorm");
var GuestStatus;
(function (GuestStatus) {
    GuestStatus["INVITED"] = "invited";
    GuestStatus["REGISTERED"] = "registered";
    GuestStatus["WAITLISTED"] = "waitlisted";
    GuestStatus["CONFIRMED"] = "confirmed";
    GuestStatus["CHECKED_IN"] = "checked_in";
    GuestStatus["NO_SHOW"] = "no_show";
    GuestStatus["CANCELLED"] = "cancelled";
})(GuestStatus || (exports.GuestStatus = GuestStatus = {}));
var GuestType;
(function (GuestType) {
    GuestType["STANDARD"] = "standard";
    GuestType["VIP"] = "vip";
    GuestType["SPEAKER"] = "speaker";
    GuestType["SPONSOR"] = "sponsor";
    GuestType["MEDIA"] = "media";
    GuestType["STAFF"] = "staff";
})(GuestType || (exports.GuestType = GuestType = {}));
var InvitationSource;
(function (InvitationSource) {
    InvitationSource["DIRECT"] = "direct";
    InvitationSource["EMAIL"] = "email";
    InvitationSource["SOCIAL"] = "social";
    InvitationSource["REFERRAL"] = "referral";
    InvitationSource["PUBLIC"] = "public";
    InvitationSource["IMPORT"] = "import";
})(InvitationSource || (exports.InvitationSource = InvitationSource = {}));
let EventGuest = class EventGuest {
    id;
    createdAt;
    updatedAt;
    eventId;
    userId;
    event;
    user;
    guestName;
    guestEmail;
    guestPhone;
    guestCompany;
    status;
    guestType;
    invitationSource;
    registrationToken;
    registeredAt;
    confirmedAt;
    checkedInAt;
    checkedInBy;
    checkInMethod;
    dietaryRestrictions;
    specialRequests;
    registrationAnswers;
    invitationSentAt;
    reminderSentAt;
    followUpSentAt;
    cancelledAt;
    cancellationReason;
    waitlistPosition;
    waitlistedAt;
    formSubmissionId;
    answers;
};
exports.EventGuest = EventGuest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventGuest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventGuest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], EventGuest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id', type: 'uuid' }),
    __metadata("design:type", String)
], EventGuest.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Event', 'guests'),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], EventGuest.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'eventGuests', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], EventGuest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "guestName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "guestEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "guestPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_company', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "guestCompany", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: GuestStatus, default: GuestStatus.INVITED }),
    __metadata("design:type", String)
], EventGuest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_type', type: 'enum', enum: GuestType, default: GuestType.STANDARD }),
    __metadata("design:type", String)
], EventGuest.prototype, "guestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_source', type: 'enum', enum: InvitationSource, default: InvitationSource.DIRECT }),
    __metadata("design:type", String)
], EventGuest.prototype, "invitationSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_token', type: 'varchar', length: 100, unique: true, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "registrationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "registeredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'confirmed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checked_in_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "checkedInAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'checked_in_by', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "checkedInBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_method', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "checkInMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dietary_restrictions', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'special_requests', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_answers', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "registrationAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invitation_sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "invitationSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reminder_sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "reminderSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_up_sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "followUpSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'waitlist_position', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "waitlistPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'waitlisted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "waitlistedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'form_submission_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], EventGuest.prototype, "formSubmissionId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventGuestAnswer', 'guest'),
    __metadata("design:type", Array)
], EventGuest.prototype, "answers", void 0);
exports.EventGuest = EventGuest = __decorate([
    (0, typeorm_1.Entity)('event_guests')
], EventGuest);
//# sourceMappingURL=event-guest.entity.js.map