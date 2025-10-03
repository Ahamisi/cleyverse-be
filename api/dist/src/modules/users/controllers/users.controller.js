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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const services_1 = require("../services");
const create_user_dto_1 = require("../dto/create-user.dto");
let UsersController = class UsersController {
    userService;
    emailVerificationService;
    constructor(userService, emailVerificationService) {
        this.userService = userService;
        this.emailVerificationService = emailVerificationService;
    }
    async register(userData) {
        return this.userService.register(userData);
    }
    async verifyEmail(token) {
        return this.emailVerificationService.verifyEmail(token);
    }
    async resendVerification(body) {
        return this.emailVerificationService.resendVerification(body.email);
    }
    async checkUsername(checkUsernameDto) {
        return this.userService.checkUsernameAvailability(checkUsernameDto.username);
    }
    async getCategories() {
        return { categories: this.userService.getCategories() };
    }
    async getGoals() {
        return { goals: this.userService.getGoals() };
    }
    async updatePersonalInfo(req, personalInfo) {
        const user = await this.userService.updatePersonalInfo(req.user.userId, personalInfo);
        return {
            message: 'Personal information updated successfully',
            user,
            nextStep: 'username'
        };
    }
    async updateUsername(req, updateUsernameDto) {
        const user = await this.userService.updateUsername(req.user.userId, updateUsernameDto?.username);
        return {
            message: 'Username updated successfully',
            user,
            nextStep: 'goal'
        };
    }
    async updateGoal(req, updateGoalDto) {
        const user = await this.userService.updateGoal(req.user.userId, updateGoalDto?.goal);
        return {
            message: 'Goal updated successfully',
            user,
            nextStep: 'platforms'
        };
    }
    async updateProfile(req, profileData) {
        return this.userService.updateProfile(req.user.userId, profileData);
    }
    async completeOnboarding(req, finalData) {
        return this.userService.completeOnboarding(req.user.userId, finalData);
    }
    async getOnboardingStatus(req) {
        return this.userService.getOnboardingStatus(req.user.userId);
    }
    async getProfile(req) {
        return this.userService.getOnboardingStatus(req.user.userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('check-username'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CheckUsernameDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('goals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getGoals", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('personal-info'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdatePersonalInfoDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePersonalInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('username'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdateUsernameDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUsername", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('goal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdateGoalDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('complete-onboarding'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CompleteOnboardingDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('onboarding-status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_1.EmailVerificationService])
], UsersController);
//# sourceMappingURL=users.controller.js.map