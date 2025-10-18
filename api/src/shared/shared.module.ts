import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { AWSSESService } from './services/aws-ses.service';
import { AWSS3Service } from './services/aws-s3.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EmailService, AWSSESService, AWSS3Service],
  exports: [EmailService, AWSSESService, AWSS3Service],
})
export class SharedModule {}

