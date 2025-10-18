export declare class QRCodeService {
    generatePaymentQR(invoiceId: string, amount: number, currency: string): Promise<{
        qrCode: string;
        qrData: string;
        expiresAt: Date;
    }>;
    generateInvoiceQR(invoice: {
        id: string;
        creatorId: string;
        amount: number;
        currency: string;
        description: string;
    }): Promise<{
        qrCode: string;
        qrData: string;
        paymentLink: string;
    }>;
    generateQRCode(data: string, options?: {
        width?: number;
        margin?: number;
        color?: {
            dark: string;
            light: string;
        };
    }): Promise<string>;
}
