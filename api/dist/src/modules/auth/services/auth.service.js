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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const temp_code_entity_1 = require("../entities/temp-code.entity");
const trusted_device_entity_1 = require("../entities/trusted-device.entity");
const email_service_1 = require("../../../shared/services/email.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersRepository;
    tempCodeRepository;
    trustedDeviceRepository;
    jwtService;
    emailService;
    constructor(usersRepository, tempCodeRepository, trustedDeviceRepository, jwtService, emailService) {
        this.usersRepository = usersRepository;
        this.tempCodeRepository = tempCodeRepository;
        this.trustedDeviceRepository = trustedDeviceRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Please set up your password first. Check your email for verification link.');
        }
        if (await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(email, password, deviceFingerprint) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (deviceFingerprint) {
            await this.updateTrustedDevice(user.id, deviceFingerprint);
        }
        const payload = {
            email: user.email,
            sub: user.id,
            username: user.username
        };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: user,
            expires_in: '7d',
            message: 'Login successful'
        };
    }
    async checkUser(email, deviceFingerprint) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found. Please register first.');
        }
        const hasPassword = !!user.password;
        let isKnownDevice = false;
        if (deviceFingerprint) {
            const trustedDevice = await this.trustedDeviceRepository.findOne({
                where: {
                    userId: user.id,
                    deviceFingerprint,
                    isActive: true
                }
            });
            isKnownDevice = !!trustedDevice;
        }
        const requiresTempCode = !hasPassword || !isKnownDevice;
        const canUsePassword = hasPassword;
        return {
            hasPassword,
            isKnownDevice,
            requiresTempCode,
            canUsePassword,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                hasCompletedOnboarding: user.hasCompletedOnboarding,
                onboardingStep: user.onboardingStep
            },
            message: 'User status checked'
        };
    }
    async sendTempCode(email, reason) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.tempCodeRepository.update({ userId: user.id, isUsed: false }, { isUsed: true });
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        const tempCode = this.tempCodeRepository.create({
            userId: user.id,
            code,
            reason,
            expiresAt,
            isUsed: false,
            attempts: 0
        });
        await this.tempCodeRepository.save(tempCode);
        await this.emailService.sendTempCodeEmail(user.email, user.username, code, reason);
        return {
            message: 'Temporary code sent to your email',
            expires_in: '15m',
            codeLength: 6
        };
    }
    async verifyTempCode(email, code, deviceFingerprint) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const tempCode = await this.tempCodeRepository.findOne({
            where: {
                userId: user.id,
                code,
                isUsed: false
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (!tempCode) {
            throw new common_1.BadRequestException('Invalid or expired temporary code');
        }
        if (new Date() > tempCode.expiresAt) {
            throw new common_1.BadRequestException('Temporary code has expired. Please request a new one.');
        }
        if (tempCode.attempts >= 5) {
            throw new common_1.BadRequestException('Too many attempts. Please request a new code.');
        }
        tempCode.attempts += 1;
        if (tempCode.code !== code) {
            await this.tempCodeRepository.save(tempCode);
            throw new common_1.BadRequestException('Invalid temporary code');
        }
        tempCode.isUsed = true;
        tempCode.usedAt = new Date();
        await this.tempCodeRepository.save(tempCode);
        if (deviceFingerprint) {
            await this.updateTrustedDevice(user.id, deviceFingerprint);
        }
        const payload = {
            email: user.email,
            sub: user.id,
            username: user.username
        };
        const { password, ...userWithoutPassword } = user;
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: userWithoutPassword,
            expires_in: '7d',
            message: 'Login successful'
        };
    }
    async resendTempCode(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const recentCode = await this.tempCodeRepository.findOne({
            where: {
                userId: user.id,
                isUsed: false
            },
            order: {
                createdAt: 'DESC'
            }
        });
        if (recentCode) {
            const timeSinceCreation = Date.now() - recentCode.createdAt.getTime();
            const oneMinute = 60 * 1000;
            if (timeSinceCreation < oneMinute) {
                throw new common_1.BadRequestException('Please wait before requesting a new code');
            }
        }
        const reason = recentCode?.reason || temp_code_entity_1.TempCodeReason.NEW_DEVICE;
        return this.sendTempCode(email, reason);
    }
    async updateTrustedDevice(userId, deviceFingerprint) {
        const existingDevice = await this.trustedDeviceRepository.findOne({
            where: {
                userId,
                deviceFingerprint
            }
        });
        if (existingDevice) {
            existingDevice.lastUsedAt = new Date();
            await this.trustedDeviceRepository.save(existingDevice);
        }
        else {
            const trustedDevice = this.trustedDeviceRepository.create({
                userId,
                deviceFingerprint,
                lastUsedAt: new Date(),
                isActive: true
            });
            await this.trustedDeviceRepository.save(trustedDevice);
        }
    }
    async cleanupExpiredCodes() {
        const now = new Date();
        await this.tempCodeRepository.delete({
            expiresAt: (0, typeorm_2.LessThan)(now),
            isUsed: true
        });
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(temp_code_entity_1.TempCode)),
    __param(2, (0, typeorm_1.InjectRepository)(trusted_device_entity_1.TrustedDevice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map