import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generatePaymentQR(invoiceId: string, amount: number, currency: string): Promise<{
    qrCode: string;
    qrData: string;
    expiresAt: Date;
  }> {
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
        dark: '#0662BB', // Cley blue
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return {
      qrCode,
      qrData,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }
  
  async generateInvoiceQR(invoice: {
    id: string;
    creatorId: string;
    amount: number;
    currency: string;
    description: string;
  }): Promise<{
    qrCode: string;
    qrData: string;
    paymentLink: string;
  }> {
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

  async generateQRCode(data: string, options?: {
    width?: number;
    margin?: number;
    color?: {
      dark: string;
      light: string;
    };
  }): Promise<string> {
    const defaultOptions = {
      width: 256,
      margin: 2,
      color: {
        dark: '#0662BB',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    return await QRCode.toDataURL(data, qrOptions);
  }
}
