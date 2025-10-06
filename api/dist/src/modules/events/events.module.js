"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_entity_1 = require("./entities/event.entity");
const event_guest_entity_1 = require("./entities/event-guest.entity");
const event_host_entity_1 = require("./entities/event-host.entity");
const event_vendor_entity_1 = require("./entities/event-vendor.entity");
const event_product_entity_1 = require("./entities/event-product.entity");
const event_registration_question_entity_1 = require("./entities/event-registration-question.entity");
const user_event_interaction_entity_1 = require("./entities/user-event-interaction.entity");
const event_service_1 = require("./services/event.service");
const guest_service_1 = require("./services/guest.service");
const vendor_service_1 = require("./services/vendor.service");
const host_service_1 = require("./services/host.service");
const registration_question_service_1 = require("./services/registration-question.service");
const event_recommendation_service_1 = require("./services/event-recommendation.service");
const recurring_event_service_1 = require("./services/recurring-event.service");
const event_controller_1 = require("./controllers/event.controller");
const guest_controller_1 = require("./controllers/guest.controller");
const vendor_controller_1 = require("./controllers/vendor.controller");
const host_controller_1 = require("./controllers/host.controller");
const registration_question_controller_1 = require("./controllers/registration-question.controller");
const event_explore_controller_1 = require("./controllers/event-explore.controller");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                event_entity_1.Event,
                event_guest_entity_1.EventGuest,
                event_host_entity_1.EventHost,
                event_vendor_entity_1.EventVendor,
                event_product_entity_1.EventProduct,
                event_registration_question_entity_1.EventRegistrationQuestion,
                event_registration_question_entity_1.EventGuestAnswer,
                user_event_interaction_entity_1.UserEventInteraction,
                user_event_interaction_entity_1.UserEventSubscription
            ])
        ],
        controllers: [
            event_controller_1.EventController,
            guest_controller_1.GuestController,
            guest_controller_1.GuestRegistrationController,
            vendor_controller_1.VendorController,
            vendor_controller_1.EventProductController,
            host_controller_1.HostController,
            host_controller_1.HostInvitationController,
            registration_question_controller_1.RegistrationQuestionController,
            event_explore_controller_1.EventExploreController,
            event_explore_controller_1.RecurringEventController
        ],
        providers: [
            event_service_1.EventService,
            guest_service_1.GuestService,
            vendor_service_1.VendorService,
            host_service_1.HostService,
            registration_question_service_1.RegistrationQuestionService,
            event_recommendation_service_1.EventRecommendationService,
            recurring_event_service_1.RecurringEventService
        ],
        exports: [
            event_service_1.EventService,
            guest_service_1.GuestService,
            vendor_service_1.VendorService,
            host_service_1.HostService,
            registration_question_service_1.RegistrationQuestionService,
            event_recommendation_service_1.EventRecommendationService,
            recurring_event_service_1.RecurringEventService
        ]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map