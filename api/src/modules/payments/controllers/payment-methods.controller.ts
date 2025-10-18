import { Controller, Get, Query } from '@nestjs/common';
import { PAYMENT_PROCESSORS_CONFIG } from '../../../config/payment.config';

interface PaymentMethod {
  processor: string;
  name: string;
  priority: number;
  methods: string[];
  features: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  icon: string;
  description: string;
  supportedCurrencies: string[];
  supportedRegions: string[];
  isRecommended: boolean;
}

@Controller('payment-methods')
export class PaymentMethodsController {
  
  @Get()
  async getPaymentMethods(
    @Query('currency') currency?: string,
    @Query('country') country?: string,
    @Query('amount') amount?: number
  ) {
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

  @Get('by-currency/:currency')
  async getPaymentMethodsByCurrency(
    @Query('currency') currency: string,
    @Query('country') country?: string
  ) {
    const methods = this.getAvailablePaymentMethods(currency, country);
    
    return {
      message: `Payment methods for ${currency}`,
      currency,
      country: country || 'US',
      methods,
      recommended: this.getRecommendedMethod(methods, currency, country)
    };
  }

  @Get('by-country/:country')
  async getPaymentMethodsByCountry(
    @Query('country') country: string,
    @Query('currency') currency?: string
  ) {
    const methods = this.getAvailablePaymentMethods(currency, country);
    
    return {
      message: `Payment methods for ${country}`,
      currency: currency || 'USD',
      country,
      methods,
      recommended: this.getRecommendedMethod(methods, currency, country)
    };
  }

  private getAvailablePaymentMethods(currency?: string, country?: string, amount?: number): PaymentMethod[] {
    const methods: PaymentMethod[] = [];

    // Check each payment processor
    Object.entries(PAYMENT_PROCESSORS_CONFIG).forEach(([processorName, config]) => {
      if (!config.enabled) return;

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

    // Sort by priority and recommendation
    return methods.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return a.priority - b.priority;
    });
  }

  private getRecommendedMethod(methods: PaymentMethod[], currency?: string, country?: string): PaymentMethod | null {
    if (methods.length === 0) return null;

    // Find the recommended method for the region
    const recommended = methods.find(method => method.isRecommended);
    if (recommended) return recommended;

    // Fallback to highest priority
    return methods[0];
  }

  private getProcessorDisplayName(processor: string): string {
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

  private getProcessorIcon(processor: string): string {
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

  private getProcessorDescription(processor: string): string {
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

  private getProcessorFees(processor: string, currency?: string) {
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
    if (!processorFees) return { percentage: 0, fixed: 0, currency: 'USD' };

    const currencyKey = currency?.toLowerCase() || 'default';
    return processorFees[currencyKey] || processorFees.default;
  }

  private isRecommendedForRegion(processor: string, country?: string): boolean {
    if (!country) return false;

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
}
