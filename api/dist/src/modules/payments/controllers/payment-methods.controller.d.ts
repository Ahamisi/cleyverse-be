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
export declare class PaymentMethodsController {
    getPaymentMethods(currency?: string, country?: string, amount?: number): Promise<{
        message: string;
        currency: string;
        country: string;
        amount: number;
        methods: PaymentMethod[];
        recommended: PaymentMethod | null;
    }>;
    getPaymentMethodsByCurrency(currency: string, country?: string): Promise<{
        message: string;
        currency: string;
        country: string;
        methods: PaymentMethod[];
        recommended: PaymentMethod | null;
    }>;
    getPaymentMethodsByCountry(country: string, currency?: string): Promise<{
        message: string;
        currency: string;
        country: string;
        methods: PaymentMethod[];
        recommended: PaymentMethod | null;
    }>;
    private getAvailablePaymentMethods;
    private getRecommendedMethod;
    private getProcessorDisplayName;
    private getProcessorIcon;
    private getProcessorDescription;
    private getProcessorFees;
    private isRecommendedForRegion;
}
export {};
