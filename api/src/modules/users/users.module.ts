import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { CreatorSettings } from './entities/creator-settings.entity';
import { CreatorPayoutSettings } from './entities/creator-payout-settings.entity';
import { Link } from '../links/entities/link.entity';
import { SocialLink } from '../links/entities/social-link.entity';
import { Collection } from '../collections/entities/collection.entity';
import { UserService } from './services/user.service';
import { EmailVerificationService } from './services/email-verification.service';
import { CreatorSettingsService } from './services/creator-settings.service';
import { UsersController } from './controllers/users.controller';
import { CreatorSettingsController } from './controllers/creator-settings.controller';
import { EmailService } from '../../shared/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      EmailVerification, 
      CreatorSettings, 
      CreatorPayoutSettings, 
      Link, 
      SocialLink, 
      Collection
    ]),
  ],
  controllers: [UsersController, CreatorSettingsController],
  providers: [UserService, EmailVerificationService, CreatorSettingsService, EmailService],
  exports: [UserService, EmailVerificationService, CreatorSettingsService],
})
export class UsersModule {}
