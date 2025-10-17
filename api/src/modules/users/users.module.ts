import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { Link } from '../links/entities/link.entity';
import { SocialLink } from '../links/entities/social-link.entity';
import { Collection } from '../collections/entities/collection.entity';
import { UserService } from './services/user.service';
import { EmailVerificationService } from './services/email-verification.service';
import { UsersController } from './controllers/users.controller';
import { EmailService } from '../../shared/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification, Link, SocialLink, Collection]),
  ],
  controllers: [UsersController],
  providers: [UserService, EmailVerificationService, EmailService],
  exports: [UserService, EmailVerificationService],
})
export class UsersModule {}
