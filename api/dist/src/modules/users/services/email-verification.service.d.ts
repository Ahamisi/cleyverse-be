import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../../shared/services/email.service';
export declare class EmailVerificationService {
    private readonly usersRepository;
    private readonly emailVerificationRepository;
    private readonly emailService;
    constructor(usersRepository: Repository<User>, emailVerificationRepository: Repository<EmailVerification>, emailService: EmailService);
    verifyEmail(token: string): Promise<{
        message: string;
        verified: boolean;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
}
