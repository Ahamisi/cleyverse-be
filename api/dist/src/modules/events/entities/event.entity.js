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
exports.Event = exports.LocationType = exports.TicketType = exports.EventVisibility = exports.EventType = exports.EventStatus = void 0;
const typeorm_1 = require("typeorm");
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "draft";
    EventStatus["PUBLISHED"] = "published";
    EventStatus["LIVE"] = "live";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["ARCHIVED"] = "archived";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var EventType;
(function (EventType) {
    EventType["CONFERENCE"] = "conference";
    EventType["WORKSHOP"] = "workshop";
    EventType["MEETUP"] = "meetup";
    EventType["WEBINAR"] = "webinar";
    EventType["NETWORKING"] = "networking";
    EventType["PARTY"] = "party";
    EventType["CONCERT"] = "concert";
    EventType["EXHIBITION"] = "exhibition";
    EventType["SEMINAR"] = "seminar";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "public";
    EventVisibility["PRIVATE"] = "private";
    EventVisibility["UNLISTED"] = "unlisted";
})(EventVisibility || (exports.EventVisibility = EventVisibility = {}));
var TicketType;
(function (TicketType) {
    TicketType["FREE"] = "free";
    TicketType["PAID"] = "paid";
    TicketType["DONATION"] = "donation";
})(TicketType || (exports.TicketType = TicketType = {}));
var LocationType;
(function (LocationType) {
    LocationType["PHYSICAL"] = "physical";
    LocationType["VIRTUAL"] = "virtual";
    LocationType["HYBRID"] = "hybrid";
})(LocationType || (exports.LocationType = LocationType = {}));
let Event = class Event {
    id;
    createdAt;
    updatedAt;
    title;
    description;
    slug;
    coverImageUrl;
    type;
    status;
    visibility;
    startDate;
    endDate;
    timezone;
    locationType;
    venueName;
    venueAddress;
    latitude;
    longitude;
    tags;
    categories;
    isRecurring;
    recurrencePattern;
    recurrenceInterval;
    recurrenceEndDate;
    parentEventId;
    targetAudience;
    experienceLevel;
    industry;
    likeCount;
    bookmarkCount;
    vendorFormId;
    guestFormId;
    engagementScore;
    virtualLink;
    meetingId;
    meetingPassword;
    ticketType;
    ticketPrice;
    currency;
    capacity;
    requireApproval;
    registrationStart;
    registrationEnd;
    allowWaitlist;
    allowGuestsInviteOthers;
    showGuestList;
    sendReminders;
    seoTitle;
    seoDescription;
    socialImageUrl;
    viewCount;
    shareCount;
    totalRegistered;
    totalAttended;
    allowVendors;
    vendorApplicationDeadline;
    vendorFee;
    publishedAt;
    cancelledAt;
    cancellationReason;
    creatorId;
    creator;
    guests;
    hosts;
    vendors;
    products;
    registrationQuestions;
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, unique: true }),
    __metadata("design:type", String)
], Event.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cover_image_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "coverImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventType, default: EventType.MEETUP }),
    __metadata("design:type", String)
], Event.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventVisibility, default: EventVisibility.PUBLIC }),
    __metadata("design:type", String)
], Event.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'UTC' }),
    __metadata("design:type", String)
], Event.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_type', type: 'enum', enum: LocationType, default: LocationType.PHYSICAL }),
    __metadata("design:type", String)
], Event.prototype, "locationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venue_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "venueName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'venue_address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "venueAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_recurring', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurrence_pattern', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "recurrencePattern", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurrence_interval', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "recurrenceInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recurrence_end_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "recurrenceEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_event_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "parentEventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_audience', type: 'text', array: true, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "targetAudience", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'experience_level', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "experienceLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'industry', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'like_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bookmark_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "bookmarkCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_form_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "vendorFormId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guest_form_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "guestFormId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'engagement_score', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "engagementScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'virtual_link', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "virtualLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meeting_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "meetingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meeting_password', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "meetingPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_type', type: 'enum', enum: TicketType, default: TicketType.FREE }),
    __metadata("design:type", String)
], Event.prototype, "ticketType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_price', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "ticketPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Event.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'require_approval', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "requireApproval", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_start', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "registrationStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_end', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "registrationEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_waitlist', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "allowWaitlist", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_guests_invite_others', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "allowGuestsInviteOthers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_guest_list', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "showGuestList", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'send_reminders', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "sendReminders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_title', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "seoTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seo_description', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "seoDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'social_image_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "socialImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'share_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "shareCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_registered', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "totalRegistered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_attended', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "totalAttended", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_vendors', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "allowVendors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_application_deadline', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "vendorApplicationDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_fee', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "vendorFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancellation_reason', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator_id', type: 'uuid' }),
    __metadata("design:type", String)
], Event.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', 'events'),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", Object)
], Event.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventGuest', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "guests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventHost', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "hosts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventVendor', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "vendors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventProduct', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('EventRegistrationQuestion', 'event'),
    __metadata("design:type", Array)
], Event.prototype, "registrationQuestions", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map