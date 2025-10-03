import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FormField } from './entities/form-field.entity';
import { FormSubmission } from './entities/form-submission.entity';
import { FormService } from './services/form.service';
import { FormsController } from './controllers/forms.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormField, FormSubmission, User]),
  ],
  controllers: [FormsController],
  providers: [FormService],
  exports: [FormService],
})
export class FormsModule {}
