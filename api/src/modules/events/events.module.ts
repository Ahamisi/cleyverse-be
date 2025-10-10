import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventGuest } from './entities/event-guest.entity';
import { EventHost } from './entities/event-host.entity';
import { EventVendor } from './entities/event-vendor.entity';
import { EventProduct } from './entities/event-product.entity';
import { EventRegistrationQuestion, EventGuestAnswer } from './entities/event-registration-question.entity';
import { UserEventInteraction, UserEventSubscription } from './entities/user-event-interaction.entity';
import { EventBooth } from './entities/event-booth.entity';
import { EventService } from './services/event.service';
import { GuestService } from './services/guest.service';
import { VendorService } from './services/vendor.service';
import { HostService } from './services/host.service';
import { RegistrationQuestionService } from './services/registration-question.service';
import { EventRecommendationService } from './services/event-recommendation.service';
import { RecurringEventService } from './services/recurring-event.service';
import { EventFormService } from './services/event-form.service';
import { FormSubmissionHandlerService } from './services/form-submission-handler.service';
import { BoothManagementService } from './services/booth-management.service';
import { EventController } from './controllers/event.controller';
import { GuestController, GuestRegistrationController } from './controllers/guest.controller';
import { VendorController, EventProductController } from './controllers/vendor.controller';
import { HostController, HostInvitationController } from './controllers/host.controller';
import { RegistrationQuestionController } from './controllers/registration-question.controller';
import { EventExploreController, RecurringEventController } from './controllers/event-explore.controller';
import { EventFormController, PublicEventFormController } from './controllers/event-form.controller';
import { FormSubmissionController, FormsWebhookController } from './controllers/form-submission.controller';
import { BoothManagementController } from './controllers/booth-management.controller';
import { FormsModule } from '../forms/forms.module';

@Module({
  imports: [
    FormsModule,
    TypeOrmModule.forFeature([
      Event,
      EventGuest,
      EventHost,
      EventVendor,
      EventProduct,
      EventRegistrationQuestion,
      EventGuestAnswer,
      UserEventInteraction,
      UserEventSubscription,
      EventBooth
    ])
  ],
  controllers: [
    EventController,
    GuestController,
    GuestRegistrationController,
    VendorController,
    EventProductController,
    HostController,
    HostInvitationController,
    RegistrationQuestionController,
    EventExploreController,
    RecurringEventController,
    EventFormController,
    PublicEventFormController,
    FormSubmissionController,
    FormsWebhookController,
    BoothManagementController
  ],
  providers: [
    EventService,
    GuestService,
    VendorService,
    HostService,
    RegistrationQuestionService,
    EventRecommendationService,
    RecurringEventService,
    EventFormService,
    FormSubmissionHandlerService,
    BoothManagementService
  ],
  exports: [
    EventService,
    GuestService,
    VendorService,
    HostService,
    RegistrationQuestionService,
    EventRecommendationService,
    RecurringEventService,
    EventFormService,
    FormSubmissionHandlerService,
    BoothManagementService
  ]
})
export class EventsModule {}
