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
exports.ResendTempCodeDto = exports.VerifyTempCodeDto = exports.SendTempCodeDto = exports.LoginDto = exports.CheckUserDto = void 0;
const class_validator_1 = require("class-validator");
const temp_code_entity_1 = require("../entities/temp-code.entity");
class CheckUserDto {
    email;
    deviceFingerprint;
}
exports.CheckUserDto = CheckUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CheckUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckUserDto.prototype, "deviceFingerprint", void 0);
class LoginDto {
    email;
    password;
    deviceFingerprint;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "deviceFingerprint", void 0);
class SendTempCodeDto {
    email;
    reason;
}
exports.SendTempCodeDto = SendTempCodeDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendTempCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(temp_code_entity_1.TempCodeReason),
    __metadata("design:type", String)
], SendTempCodeDto.prototype, "reason", void 0);
class VerifyTempCodeDto {
    email;
    code;
    deviceFingerprint;
}
exports.VerifyTempCodeDto = VerifyTempCodeDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyTempCodeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], VerifyTempCodeDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyTempCodeDto.prototype, "deviceFingerprint", void 0);
class ResendTempCodeDto {
    email;
}
exports.ResendTempCodeDto = ResendTempCodeDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendTempCodeDto.prototype, "email", void 0);
//# sourceMappingURL=auth.dto.js.map