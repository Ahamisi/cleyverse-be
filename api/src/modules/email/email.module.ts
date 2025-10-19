import { Module } from '@nestjs/common';
import { EmailTestController } from './email-test.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [EmailTestController],
})
export class EmailModule {}
