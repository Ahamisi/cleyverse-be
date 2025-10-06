import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventGuest } from './entities/event-guest.entity';
import { EventHost } from './entities/event-host.entity';
import { EventVendor } from './entities/event-vendor.entity';
import { EventProduct } from './entities/event-product.entity';
import { EventRegistrationQuestion, EventGuestAnswer } from './entities/event-registration-question.entity';
import { UserEventInteraction, UserEventSubscription } from './entities/user-event-interaction.entity';
import { EventService } from './services/event.service';
import { GuestService } from './services/guest.service';
import { VendorService } from './services/vendor.service';
import { HostService } from './services/host.service';
import { RegistrationQuestionService } from './services/registration-question.service';
import { EventRecommendationService } from './services/event-recommendation.service';
import { RecurringEventService } from './services/recurring-event.service';
import { EventController } from './controllers/event.controller';
import { GuestController, GuestRegistrationController } from './controllers/guest.controller';
import { VendorController, EventProductController } from './controllers/vendor.controller';
import { HostController, HostInvitationController } from './controllers/host.controller';
import { RegistrationQuestionController } from './controllers/registration-question.controller';
import { EventExploreController, RecurringEventController } from './controllers/event-explore.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventGuest,
      EventHost,
      EventVendor,
      EventProduct,
      EventRegistrationQuestion,
      EventGuestAnswer,
      UserEventInteraction,
      UserEventSubscription
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
    RecurringEventController
  ],
  providers: [
    EventService,
    GuestService,
    VendorService,
    HostService,
    RegistrationQuestionService,
    EventRecommendationService,
    RecurringEventService
  ],
  exports: [
    EventService,
    GuestService,
    VendorService,
    HostService,
    RegistrationQuestionService,
    EventRecommendationService,
    RecurringEventService
  ]
})
export class EventsModule {}
