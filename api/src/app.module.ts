import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LinksModule } from './modules/links/links.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { FormsModule } from './modules/forms/forms.module';
import { User } from './modules/users/entities/user.entity';
import { EmailVerification } from './modules/users/entities/email-verification.entity';
import { Link } from './modules/links/entities/link.entity';
import { SocialLink } from './modules/links/entities/social-link.entity';
import { Collection } from './modules/collections/entities/collection.entity';
import { Form } from './modules/forms/entities/form.entity';
import { FormField } from './modules/forms/entities/form-field.entity';
import { FormSubmission } from './modules/forms/entities/form-submission.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, EmailVerification, Link, SocialLink, Collection, Form, FormField, FormSubmission],
      synchronize: true, // Only for development - will change to migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    AuthModule,
    LinksModule,
    CollectionsModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
