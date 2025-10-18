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
exports.EmailVerificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const email_verification_entity_1 = require("../entities/email-verification.entity");
const email_service_1 = require("../../../shared/services/email.service");
const crypto = __importStar(require("crypto"));
let EmailVerificationService = class EmailVerificationService {
    usersRepository;
    emailVerificationRepository;
    emailService;
    constructor(usersRepository, emailVerificationRepository, emailService) {
        this.usersRepository = usersRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.emailService = emailService;
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Verification token is required');
        }
        const verification = await this.emailVerificationRepository.findOne({
            where: { token, isUsed: false },
            relations: ['user']
        });
        if (!verification) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        if (new Date() > verification.expiresAt) {
            throw new common_1.BadRequestException('Verification token has expired');
        }
        await this.usersRepository.update(verification.userId, {
            isEmailVerified: true,
            emailVerifiedAt: new Date()
        });
        await this.emailVerificationRepository.update(verification.id, {
            isUsed: true
        });
        await this.emailService.sendWelcomeEmail(verification.user.email, verification.user.username);
        return {
            message: 'Email verified successfully! Welcome to Cleyverse!',
            verified: true
        };
    }
    async resendVerification(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const verification = this.emailVerificationRepository.create({
            userId: user.id,
            token,
        });
        await this.emailVerificationRepository.save(verification);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        await this.emailService.sendVerificationEmail(user.email, user.username, verificationUrl);
        return {
            message: 'Verification email sent successfully'
        };
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(email_verification_entity_1.EmailVerification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map