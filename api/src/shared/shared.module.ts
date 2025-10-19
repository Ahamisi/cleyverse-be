import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './services/email.service';
import { AWSSESService } from './services/aws-ses.service';
import { AWSS3Service } from './services/aws-s3.service';
import { EmailTrackingService } from './services/email-tracking.service';
import { EmailLog } from './entities/email-log.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EmailLog]),
  ],
  providers: [EmailService, AWSSESService, AWSS3Service, EmailTrackingService],
  exports: [EmailService, AWSSESService, AWSS3Service, EmailTrackingService],
})
export class SharedModule {}

