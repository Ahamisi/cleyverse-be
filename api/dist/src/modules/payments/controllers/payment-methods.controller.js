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
exports.PaymentMethodsController = void 0;
const common_1 = require("@nestjs/common");
const payment_config_1 = require("../../../config/payment.config");
let PaymentMethodsController = class PaymentMethodsController {
    async getPaymentMethods(currency, country, amount) {
        const availableMethods = this.getAvailablePaymentMethods(currency, country, amount);
        return {
            message: 'Payment methods retrieved successfully',
            currency: currency || 'USD',
            country: country || 'US',
            amount: amount || 0,
            methods: availableMethods,
            recommended: this.getRecommendedMethod(availableMethods, currency, country)
        };
    }
    async getPaymentMethodsByCurrency(currency, country) {
        const methods = this.getAvailablePaymentMethods(currency, country);
        return {
            message: `Payment methods for ${currency}`,
            currency,
            country: country || 'US',
            methods,
            recommended: this.getRecommendedMethod(methods, currency, country)
        };
    }
    async getPaymentMethodsByCountry(country, currency) {
        const methods = this.getAvailablePaymentMethods(currency, country);
        return {
            message: `Payment methods for ${country}`,
            currency: currency || 'USD',
            country,
            methods,
            recommended: this.getRecommendedMethod(methods, currency, country)
        };
    }
    getAvailablePaymentMethods(currency, country, amount) {
        const methods = [];
        Object.entries(payment_config_1.PAYMENT_PROCESSORS_CONFIG).forEach(([processorName, config]) => {
            if (!config.enabled)
                return;
            const isCurrencySupported = !currency || config.currencies.includes(currency.toUpperCase());
            const isRegionSupported = !country || config.regions.includes(country.toUpperCase());
            if (isCurrencySupported && isRegionSupported) {
                methods.push({
                    processor: processorName,
                    name: this.getProcessorDisplayName(processorName),
                    priority: config.priority,
                    methods: config.methods,
                    features: config.features,
                    fees: this.getProcessorFees(processorName, currency),
                    icon: this.getProcessorIcon(processorName),
                    description: this.getProcessorDescription(processorName),
                    supportedCurrencies: config.currencies,
                    supportedRegions: config.regions,
                    isRecommended: this.isRecommendedForRegion(processorName, country)
                });
            }
        });
        return methods.sort((a, b) => {
            if (a.isRecommended && !b.isRecommended)
                return -1;
            if (!a.isRecommended && b.isRecommended)
                return 1;
            return a.priority - b.priority;
        });
    }
    getRecommendedMethod(methods, currency, country) {
        if (methods.length === 0)
            return null;
        const recommended = methods.find(method => method.isRecommended);
        if (recommended)
            return recommended;
        return methods[0];
    }
    getProcessorDisplayName(processor) {
        const names = {
            paystack: 'Paystack',
            stripe: 'Stripe',
            paypal: 'PayPal',
            razorpay: 'Razorpay',
            flutterwave: 'Flutterwave',
            coinbase: 'Coinbase Commerce',
            bitpay: 'BitPay'
        };
        return names[processor] || processor;
    }
    getProcessorIcon(processor) {
        const icons = {
            paystack: 'https://paystack.com/assets/img/paystack-logo.png',
            stripe: 'https://js.stripe.com/v3/fingerprinted/img/stripe-logo.png',
            paypal: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg',
            razorpay: 'https://razorpay.com/assets/razorpay-logo.svg',
            flutterwave: 'https://flutterwave.com/images/flutterwave-logo.svg',
            coinbase: 'https://commerce.coinbase.com/coinbase-logo.png',
            bitpay: 'https://bitpay.com/images/bitpay-logo.svg'
        };
        return icons[processor] || '';
    }
    getProcessorDescription(processor) {
        const descriptions = {
            paystack: 'Fast and secure payments for Africa. Supports cards, bank transfers, and mobile money.',
            stripe: 'Global payment processing with advanced fraud protection and instant settlements.',
            paypal: 'Trusted worldwide payment platform with buyer protection and easy checkout.',
            razorpay: 'Complete payment solutions for India with support for all major payment methods.',
            flutterwave: 'Payment infrastructure for Africa with support for local and international cards.',
            coinbase: 'Accept cryptocurrency payments with automatic conversion to fiat currency.',
            bitpay: 'Bitcoin and cryptocurrency payment processing with enterprise-grade security.'
        };
        return descriptions[processor] || '';
    }
    getProcessorFees(processor, currency) {
        const feeStructure = {
            paystack: {
                ngn: { percentage: 1.5, fixed: 0, currency: 'NGN' },
                ghs: { percentage: 2.0, fixed: 0, currency: 'GHS' },
                kes: { percentage: 2.0, fixed: 0, currency: 'KES' },
                zar: { percentage: 2.5, fixed: 0, currency: 'ZAR' },
                default: { percentage: 3.0, fixed: 0, currency: 'USD' }
            },
            stripe: {
                usd: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
                eur: { percentage: 2.9, fixed: 0.25, currency: 'EUR' },
                gbp: { percentage: 2.9, fixed: 0.20, currency: 'GBP' },
                default: { percentage: 3.4, fixed: 0.30, currency: 'USD' }
            },
            paypal: {
                usd: { percentage: 3.49, fixed: 0.49, currency: 'USD' },
                eur: { percentage: 3.49, fixed: 0.35, currency: 'EUR' },
                gbp: { percentage: 3.49, fixed: 0.30, currency: 'GBP' },
                default: { percentage: 3.49, fixed: 0.49, currency: 'USD' }
            },
            razorpay: {
                inr: { percentage: 2.0, fixed: 0, currency: 'INR' },
                default: { percentage: 2.0, fixed: 0, currency: 'INR' }
            },
            flutterwave: {
                ngn: { percentage: 1.4, fixed: 0, currency: 'NGN' },
                ghs: { percentage: 1.4, fixed: 0, currency: 'GHS' },
                kes: { percentage: 1.4, fixed: 0, currency: 'KES' },
                default: { percentage: 1.4, fixed: 0, currency: 'USD' }
            },
            coinbase: {
                default: { percentage: 1.0, fixed: 0, currency: 'USD' }
            },
            bitpay: {
                default: { percentage: 1.0, fixed: 0, currency: 'USD' }
            }
        };
        const processorFees = feeStructure[processor];
        if (!processorFees)
            return { percentage: 0, fixed: 0, currency: 'USD' };
        const currencyKey = currency?.toLowerCase() || 'default';
        return processorFees[currencyKey] || processorFees.default;
    }
    isRecommendedForRegion(processor, country) {
        if (!country)
            return false;
        const recommendations = {
            paystack: ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'ZM', 'RW'],
            stripe: ['US', 'EU', 'UK', 'CA', 'AU'],
            razorpay: ['IN'],
            flutterwave: ['NG', 'GH', 'KE', 'ZA'],
            paypal: ['US', 'EU', 'UK', 'CA', 'AU', 'MX', 'BR'],
            coinbase: ['US', 'EU', 'UK'],
            bitpay: ['US', 'EU', 'UK']
        };
        return recommendations[processor]?.includes(country.toUpperCase()) || false;
    }
};
exports.PaymentMethodsController = PaymentMethodsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('currency')),
    __param(1, (0, common_1.Query)('country')),
    __param(2, (0, common_1.Query)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)('by-currency/:currency'),
    __param(0, (0, common_1.Query)('currency')),
    __param(1, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "getPaymentMethodsByCurrency", null);
__decorate([
    (0, common_1.Get)('by-country/:country'),
    __param(0, (0, common_1.Query)('country')),
    __param(1, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "getPaymentMethodsByCountry", null);
exports.PaymentMethodsController = PaymentMethodsController = __decorate([
    (0, common_1.Controller)('payment-methods')
], PaymentMethodsController);
//# sourceMappingURL=payment-methods.controller.js.map