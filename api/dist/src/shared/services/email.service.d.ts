export declare class EmailService {
    private readonly logger;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendWelcomeEmail(to: string, username: string): Promise<void>;
    sendTempCodeEmail(to: string, username: string, code: string, reason: string): Promise<void>;
}
