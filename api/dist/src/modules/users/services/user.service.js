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
const email_verification_service_1 = require("./email-verification.service");
const email_service_1 = require("../../../shared/services/email.service");
const link_entity_1 = require("../../links/entities/link.entity");
const social_link_entity_1 = require("../../links/entities/social-link.entity");
const collection_entity_1 = require("../../collections/entities/collection.entity");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let UserService = class UserService extends base_service_1.BaseService {
    userRepository;
    emailVerificationRepository;
    linkRepository;
    socialLinkRepository;
    collectionRepository;
    emailService;
    emailVerificationService;
    constructor(userRepository, emailVerificationRepository, linkRepository, socialLinkRepository, collectionRepository, emailService, emailVerificationService) {
        super(userRepository);
        this.userRepository = userRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.linkRepository = linkRepository;
        this.socialLinkRepository = socialLinkRepository;
        this.collectionRepository = collectionRepository;
        this.emailService = emailService;
        this.emailVerificationService = emailVerificationService;
    }
    getEntityName() {
        return 'User';
    }
    async register(createUserDto) {
        const { email, username, password } = createUserDto;
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        if (!username) {
            throw new common_1.BadRequestException('Username is required');
        }
        const existingUserByEmail = await this.userRepository.findOne({
            where: { email }
        });
        if (existingUserByEmail) {
            if (existingUserByEmail.password) {
                throw new common_1.BadRequestException('An account with this email already exists. Please login to continue.');
            }
            else {
                throw new common_1.BadRequestException('An account with this email already exists. Please check your email to verify your account and set up your password.');
            }
        }
        const existingUserByUsername = await this.userRepository.findOne({
            where: { username }
        });
        if (existingUserByUsername) {
            throw new common_1.BadRequestException('This username is already taken. Please choose a different username.');
        }
        let userData = {
            email,
            username,
            isEmailVerified: false,
            onboardingStep: 2
        };
        if (password) {
            userData.password = await this.hashPassword(password);
        }
        else {
            userData.password = null;
        }
        const user = await this.create(userData);
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
        const updatedUser = await this.update(userId, {
            ...finalData,
            hasCompletedOnboarding: true,
            onboardingStep: 4
        });
        return this.excludeFields(updatedUser, ['password']);
    }
    async getOnboardingStatus(userId) {
        const user = await this.findById(userId);
        const userResult = this.excludeFields(user, ['password']);
        const smartOnboardingStep = this.calculateOnboardingStep(user);
        return {
            user: userResult,
            onboardingStep: smartOnboardingStep,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            isEmailVerified: user.isEmailVerified,
            nextSteps: this.getNextSteps(user, user.isEmailVerified)
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
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        await this.emailService.sendVerificationEmail(user.email, user.username, verificationUrl);
    }
    calculateOnboardingStep(user) {
        let step = 1;
        step = 1;
        if (user.firstName && user.lastName) {
            step = 2;
        }
        if (user.category) {
            step = 3;
        }
        if (user.goal) {
            step = 4;
        }
        return step;
    }
    getNextSteps(user, isEmailVerified) {
        const steps = [];
        if (!isEmailVerified) {
            steps.push('verify-email');
        }
        if (!user.firstName || !user.lastName) {
            steps.push('personal-info');
        }
        if (!user.category) {
            steps.push('category');
        }
        if (!user.goal) {
            steps.push('goal');
        }
        if (!user.profileTitle || !user.bio || (!user.profileImageUrl && !user.profileImageGradient)) {
            steps.push('profile');
        }
        return steps;
    }
    async setupPassword(userId, password) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.password) {
            throw new common_1.BadRequestException('Password already set for this user. Use the update password endpoint instead.');
        }
        const hashedPassword = await this.hashPassword(password);
        await this.userRepository.update(userId, { password: hashedPassword });
        return this.findById(userId);
    }
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.password) {
            throw new common_1.BadRequestException('Please set up your password first');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const hashedPassword = await this.hashPassword(newPassword);
        await this.userRepository.update(userId, { password: hashedPassword });
        return this.findById(userId);
    }
    async verifyEmailAndSetupPassword(token, password) {
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
        await this.userRepository.update(verification.userId, {
            isEmailVerified: true,
            emailVerifiedAt: new Date()
        });
        await this.emailVerificationRepository.update(verification.id, {
            isUsed: true
        });
        return this.setupPassword(verification.userId, password);
    }
    async hashPassword(password) {
        if (!password) {
            throw new common_1.BadRequestException('Password is required');
        }
        if (typeof password !== 'string') {
            throw new common_1.BadRequestException('Password must be a string');
        }
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async getPublicProfile(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
                select: [
                    'id', 'username', 'firstName', 'lastName', 'profileTitle', 'bio',
                    'profileImageUrl', 'profileImageGradient', 'category', 'goal', 'createdAt'
                ]
            });
            if (!user) {
                return {
                    message: 'User not found',
                    user: null,
                    links: [],
                    socialLinks: [],
                    collections: [],
                    exists: false
                };
            }
            const links = await this.linkRepository.find({
                where: { userId: user.id, isActive: true },
                order: { displayOrder: 'ASC' },
                select: [
                    'id', 'title', 'url', 'type', 'layout', 'isActive', 'displayOrder',
                    'clickCount', 'createdAt'
                ]
            });
            const socialLinks = await this.socialLinkRepository.find({
                where: { userId: user.id, isActive: true },
                order: { displayOrder: 'ASC' },
                select: [
                    'id', 'platform', 'url', 'username', 'isActive', 'displayOrder',
                    'clickCount', 'createdAt'
                ]
            });
            const collections = await this.collectionRepository.find({
                where: { userId: user.id, isActive: true },
                order: { displayOrder: 'ASC' },
                select: [
                    'id', 'title', 'description', 'layout', 'isActive', 'displayOrder',
                    'linkCount', 'createdAt'
                ]
            });
            for (const collection of collections) {
                const collectionLinks = await this.linkRepository
                    .createQueryBuilder('link')
                    .leftJoin('link.collections', 'collection')
                    .where('collection.id = :collectionId', { collectionId: collection.id })
                    .andWhere('link.isActive = :isActive', { isActive: true })
                    .orderBy('link.displayOrder', 'ASC')
                    .select([
                    'link.id', 'link.title', 'link.url', 'link.type'
                ])
                    .getMany();
                collection.links = collectionLinks;
            }
            return {
                message: 'User profile retrieved successfully',
                user: {
                    ...user,
                    category: user.category ? this.formatCategoryLabel(user.category) : null,
                    goal: user.goal ? this.formatGoalLabel(user.goal) : null
                },
                links,
                socialLinks,
                collections,
                exists: true
            };
        }
        catch (error) {
            console.error('Error in getPublicProfile:', error);
            throw error;
        }
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
    formatGoalLabel(goal) {
        const labels = {
            [user_entity_1.UserGoal.CREATOR]: 'Creator',
            [user_entity_1.UserGoal.BUSINESS]: 'Business',
            [user_entity_1.UserGoal.PERSONAL]: 'Personal'
        };
        return labels[goal] || goal;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(email_verification_entity_1.EmailVerification)),
    __param(2, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __param(3, (0, typeorm_1.InjectRepository)(social_link_entity_1.SocialLink)),
    __param(4, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        email_verification_service_1.EmailVerificationService])
], UserService);
//# sourceMappingURL=user.service.js.map