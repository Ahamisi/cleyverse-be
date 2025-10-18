"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
let EmailService = class EmailService {
    async sendEmail(emailData) {
        console.log('Sending email:', {
            to: emailData.to,
            subject: emailData.subject,
            template: emailData.template,
            data: emailData.data
        });
    }
    async sendTempCodeEmail(email, username, code, reason) {
        await this.sendEmail({
            to: email,
            subject: `Your temporary access code - ${reason}`,
            template: 'temp-code',
            data: { username, code, reason }
        });
    }
    async sendWelcomeEmail(email, username) {
        await this.sendEmail({
            to: email,
            subject: 'Welcome to Cleyverse!',
            template: 'welcome',
            data: { username }
        });
    }
    async sendVerificationEmail(email, username, verificationUrl) {
        await this.sendEmail({
            to: email,
            subject: 'Verify your email address',
            template: 'verification',
            data: { username, verificationUrl }
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map