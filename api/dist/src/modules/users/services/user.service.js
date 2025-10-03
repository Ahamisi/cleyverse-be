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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_service_1 = require("../../../common/base/base.service");
const user_entity_1 = require("../entities/user.entity");
const email_verification_entity_1 = require("../entities/email-verification.entity");
const email_service_1 = require("../../../shared/services/email.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let UserService = class UserService extends base_service_1.BaseService {
    userRepository;
    emailVerificationRepository;
    emailService;
    constructor(userRepository, emailVerificationRepository, emailService) {
        super(userRepository);
        this.userRepository = userRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.emailService = emailService;
    }
    getEntityName() {
        return 'User';
    }
    async register(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [{ email: createUserDto.email }, { username: createUserDto.username }]
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email or username already exists');
        }
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = await this.create({
            ...createUserDto,
            password: hashedPassword,
            isEmailVerified: false
        });
        await this.createEmailVerification(user.id);
        return this.excludeFields(user, ['password']);
    }
    async updatePersonalInfo(userId, personalInfo) {
        const user = await this.findById(userId);
        const updateData = {
            onboardingStep: Math.max(user.onboardingStep, 2)
        };
        if (personalInfo?.firstName !== undefined) {
            updateData.firstName = personalInfo.firstName;
        }
        if (personalInfo?.lastName !== undefined) {
            updateData.lastName = personalInfo.lastName;
        }
        if (personalInfo?.category !== undefined) {
            updateData.category = personalInfo.category;
        }
        const updatedUser = await this.update(userId, updateData);
        return this.excludeFields(updatedUser, ['password']);
    }
    async updateUsername(userId, username) {
        if (!username) {
            throw new common_1.BadRequestException('Username is required');
        }
        const user = await this.findById(userId);
        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser && existingUser.id !== userId) {
            throw new common_1.BadRequestException('Username is already taken');
        }
        const updatedUser = await this.update(userId, {
            username,
            onboardingStep: Math.max(user.onboardingStep, 3)
        });
        return this.excludeFields(updatedUser, ['password']);
    }
    async updateGoal(userId, goal) {
        if (!goal) {
            throw new common_1.BadRequestException('Goal is required');
        }
        const user = await this.findById(userId);
        const updatedUser = await this.update(userId, {
            goal,
            onboardingStep: Math.max(user.onboardingStep, 4)
        });
        return this.excludeFields(updatedUser, ['password']);
    }
    async updateProfile(userId, profileData) {
        const user = await this.findById(userId);
        const updatedUser = await this.update(userId, {
            ...profileData,
            onboardingStep: Math.max(user.onboardingStep, 5)
        });
        return this.excludeFields(updatedUser, ['password']);
    }
    async completeOnboarding(userId, finalData) {
        const user = await this.findById(userId);
        if (!user.isEmailVerified) {
            throw new common_1.BadRequestException('Please verify your email before completing onboarding');
        }
        const updatedUser = await this.update(userId, {
            ...finalData,
            hasCompletedOnboarding: true,
            onboardingStep: 6
        });
        return this.excludeFields(updatedUser, ['password']);
    }
    async getOnboardingStatus(userId) {
        const user = await this.findById(userId);
        const userResult = this.excludeFields(user, ['password']);
        return {
            user: userResult,
            onboardingStep: user.onboardingStep,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            isEmailVerified: user.isEmailVerified,
            nextSteps: this.getNextSteps(user.onboardingStep, user.isEmailVerified)
        };
    }
    async checkUsernameAvailability(username) {
        const existingUser = await this.userRepository.findOne({ where: { username } });
        return {
            available: !existingUser,
            username,
            message: existingUser ? 'Username is already taken' : 'Username is available'
        };
    }
    getCategories() {
        return Object.values(user_entity_1.UserCategory).map(category => ({
            value: category,
            label: this.formatCategoryLabel(category)
        }));
    }
    getGoals() {
        return [
            {
                value: user_entity_1.UserGoal.CREATOR,
                label: 'Creator',
                description: 'Build my following and explore ways to monetize my audience.'
            },
            {
                value: user_entity_1.UserGoal.BUSINESS,
                label: 'Business',
                description: 'Grow my business and reach more customers.'
            },
            {
                value: user_entity_1.UserGoal.PERSONAL,
                label: 'Personal',
                description: 'Share links with my friends and acquaintances.'
            }
        ];
    }
    async createEmailVerification(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const verification = this.emailVerificationRepository.create({
            userId,
            token,
        });
        await this.emailVerificationRepository.save(verification);
        const user = await this.findById(userId);
        await this.emailService.sendVerificationEmail(user.email, token);
    }
    getNextSteps(currentStep, isEmailVerified) {
        const steps = [];
        if (!isEmailVerified)
            steps.push('verify-email');
        if (currentStep < 2)
            steps.push('personal-info');
        if (currentStep < 3)
            steps.push('username');
        if (currentStep < 4)
            steps.push('goal');
        if (currentStep < 5)
            steps.push('platforms');
        if (currentStep < 6)
            steps.push('profile');
        return steps;
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    formatCategoryLabel(category) {
        const labels = {
            [user_entity_1.UserCategory.BUSINESS]: 'Business',
            [user_entity_1.UserCategory.CREATIVE]: 'Creative',
            [user_entity_1.UserCategory.EDUCATION]: 'Education',
            [user_entity_1.UserCategory.ENTERTAINMENT]: 'Entertainment',
            [user_entity_1.UserCategory.FASHION_BEAUTY]: 'Fashion & Beauty',
            [user_entity_1.UserCategory.FOOD_BEVERAGE]: 'Food & Beverage',
            [user_entity_1.UserCategory.GOVERNMENT_POLITICS]: 'Government & Politics',
            [user_entity_1.UserCategory.HEALTH_WELLNESS]: 'Health & Wellness',
            [user_entity_1.UserCategory.NON_PROFIT]: 'Non-Profit',
            [user_entity_1.UserCategory.OTHER]: 'Other',
            [user_entity_1.UserCategory.TECH]: 'Tech',
            [user_entity_1.UserCategory.TRAVEL_TOURISM]: 'Travel & Tourism'
        };
        return labels[category] || category;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(email_verification_entity_1.EmailVerification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], UserService);
//# sourceMappingURL=user.service.js.map