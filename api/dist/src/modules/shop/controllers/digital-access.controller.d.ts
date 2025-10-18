import type { Response } from 'express';
import { DigitalDeliveryService } from '../services/digital-delivery.service';
import { Repository } from 'typeorm';
import { DigitalAccess } from '../entities/digital-access.entity';
export declare class AccessVerificationDto {
    password?: string;
    deviceFingerprint?: string;
}
export declare class DigitalAccessController {
    private readonly digitalDeliveryService;
    private readonly digitalAccessRepository;
    constructor(digitalDeliveryService: DigitalDeliveryService, digitalAccessRepository: Repository<DigitalAccess>);
    verifyAccess(accessToken: string, query: AccessVerificationDto, req: any, res: Response): Promise<void>;
    downloadFile(accessToken: string, query: AccessVerificationDto, req: any, res: Response): Promise<void>;
}
