"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
let EmailService = EmailService_1 = class EmailService {
    logger = new common_1.Logger(EmailService_1.name);
    async sendVerificationEmail(to, token) {
        const verificationLink = `http://localhost:3000/users/verify-email?token=${token}`;
        this.logger.log(`Sending verification email to ${to} with link: ${verificationLink}`);
    }
    async sendWelcomeEmail(to, username) {
        this.logger.log(`Sending welcome email to ${to}. Welcome, ${username}!`);
    }
    async sendTempCodeEmail(to, username, code, reason) {
        const reasonMessages = {
            new_device: 'logging in from a new device',
            forgot_password: 'resetting your password',
            onboarding: 'completing your registration'
        };
        const reasonMessage = reasonMessages[reason] || 'logging in';
        this.logger.log(`
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      📧 TEMPORARY LOGIN CODE EMAIL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      To: ${to}
      Username: ${username}
      Reason: ${reasonMessage}
      
      Your temporary login code is:
      
      ╔═══════════════╗
      ║   ${code}   ║
      ╚═══════════════╝
      
      This code will expire in 15 minutes.
      
      If you didn't request this code, please ignore this email.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map