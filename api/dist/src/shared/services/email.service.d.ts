export interface EmailData {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
export declare class EmailService {
    sendEmail(emailData: EmailData): Promise<void>;
    sendTempCodeEmail(email: string, username: string, code: string, reason: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
    sendVerificationEmail(email: string, username: string, verificationUrl: string): Promise<void>;
}
