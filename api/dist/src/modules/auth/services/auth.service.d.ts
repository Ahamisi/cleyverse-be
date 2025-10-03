import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: any;
        expires_in: string;
    }>;
    hashPassword(password: string): Promise<string>;
}
