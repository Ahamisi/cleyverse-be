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
exports.SearchGuestsDto = exports.RegisterGuestDto = exports.CheckInGuestDto = exports.UpdateGuestStatusDto = exports.ImportGuestsDto = exports.BulkInviteGuestsDto = exports.InviteGuestDto = void 0;
const class_validator_1 = require("class-validator");
const event_guest_entity_1 = require("../entities/event-guest.entity");
class InviteGuestDto {
    userId;
    guestName;
    guestEmail;
    guestPhone;
    guestCompany;
    guestType;
    invitationSource;
    personalMessage;
}
exports.InviteGuestDto = InviteGuestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "guestName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "guestEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "guestPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "guestCompany", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.GuestType),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "guestType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.InvitationSource),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "invitationSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteGuestDto.prototype, "personalMessage", void 0);
class BulkInviteGuestsDto {
    guests;
    personalMessage;
    sendImmediately = true;
}
exports.BulkInviteGuestsDto = BulkInviteGuestsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BulkInviteGuestsDto.prototype, "guests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkInviteGuestsDto.prototype, "personalMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkInviteGuestsDto.prototype, "sendImmediately", void 0);
class ImportGuestsDto {
    emails;
    guestType;
    personalMessage;
}
exports.ImportGuestsDto = ImportGuestsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], ImportGuestsDto.prototype, "emails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.GuestType),
    __metadata("design:type", String)
], ImportGuestsDto.prototype, "guestType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportGuestsDto.prototype, "personalMessage", void 0);
class UpdateGuestStatusDto {
    status;
    reason;
}
exports.UpdateGuestStatusDto = UpdateGuestStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(event_guest_entity_1.GuestStatus),
    __metadata("design:type", String)
], UpdateGuestStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGuestStatusDto.prototype, "reason", void 0);
class CheckInGuestDto {
    checkInMethod = 'manual';
    notes;
}
exports.CheckInGuestDto = CheckInGuestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CheckInGuestDto.prototype, "checkInMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckInGuestDto.prototype, "notes", void 0);
class RegisterGuestDto {
    registrationToken;
    guestName;
    guestPhone;
    guestCompany;
    dietaryRestrictions;
    specialRequests;
    registrationAnswers;
}
exports.RegisterGuestDto = RegisterGuestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "registrationToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "guestName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "guestPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "guestCompany", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterGuestDto.prototype, "specialRequests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RegisterGuestDto.prototype, "registrationAnswers", void 0);
class SearchGuestsDto {
    search;
    status;
    guestType;
    invitationSource;
    sortBy = 'createdAt';
    sortOrder = 'DESC';
}
exports.SearchGuestsDto = SearchGuestsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.GuestStatus),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.GuestType),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "guestType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(event_guest_entity_1.InvitationSource),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "invitationSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchGuestsDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=guest.dto.js.map