import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { UserService } from './services/user.service';
import { EmailVerificationService } from './services/email-verification.service';
import { UsersController } from './controllers/users.controller';
import { EmailService } from '../../shared/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification]),
  ],
  controllers: [UsersController],
  providers: [UserService, EmailVerificationService, EmailService],
  exports: [UserService, EmailVerificationService],
})
export class UsersModule {}
