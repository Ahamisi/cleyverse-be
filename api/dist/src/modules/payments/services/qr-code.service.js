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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeService = void 0;
const common_1 = require("@nestjs/common");
const QRCode = __importStar(require("qrcode"));
let QRCodeService = class QRCodeService {
    async generatePaymentQR(invoiceId, amount, currency) {
        const paymentData = {
            invoiceId,
            amount,
            currency,
            timestamp: new Date().toISOString(),
            type: 'payment'
        };
        const qrData = JSON.stringify(paymentData);
        const qrCode = await QRCode.toDataURL(qrData, {
            width: 256,
            margin: 2,
            color: {
                dark: '#0662BB',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });
        return {
            qrCode,
            qrData,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
    }
    async generateInvoiceQR(invoice) {
        const paymentLink = `https://cley.me/pay/${invoice.id}`;
        const invoiceData = {
            invoiceId: invoice.id,
            creatorId: invoice.creatorId,
            amount: invoice.amount,
            currency: invoice.currency,
            description: invoice.description,
            paymentLink,
            timestamp: new Date().toISOString(),
            type: 'invoice'
        };
        const qrData = JSON.stringify(invoiceData);
        const qrCode = await QRCode.toDataURL(qrData, {
            width: 256,
            margin: 2,
            color: {
                dark: '#0662BB',
                light: '#FFFFFF'
            }
        });
        return {
            qrCode,
            qrData,
            paymentLink
        };
    }
    async generateQRCode(data, options) {
        const defaultOptions = {
            width: 256,
            margin: 2,
            color: {
                dark: '#0662BB',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        };
        const qrOptions = { ...defaultOptions, ...options };
        return await QRCode.toDataURL(data, qrOptions);
    }
};
exports.QRCodeService = QRCodeService;
exports.QRCodeService = QRCodeService = __decorate([
    (0, common_1.Injectable)()
], QRCodeService);
//# sourceMappingURL=qr-code.service.js.map