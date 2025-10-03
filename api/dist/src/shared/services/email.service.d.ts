export declare class EmailService {
    private readonly logger;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendWelcomeEmail(to: string, username: string): Promise<void>;
}
