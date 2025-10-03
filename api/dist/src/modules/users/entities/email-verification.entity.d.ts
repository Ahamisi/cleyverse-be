import { BaseEntity } from '../../../common/base/base.entity';
import { User } from './user.entity';
export declare class EmailVerification extends BaseEntity {
    userId: string;
    user: User;
    token: string;
    expiresAt: Date;
    isUsed: boolean;
}
