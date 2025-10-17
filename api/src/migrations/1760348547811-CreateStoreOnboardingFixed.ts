import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreOnboardingFixed1760348547811 implements MigrationInterface {
    name = 'CreateStoreOnboardingFixed1760348547811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."store_onboarding_currentstep_enum" AS ENUM('welcome', 'business_type', 'sales_channels', 'product_type', 'store_setup', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."store_onboarding_businesstype_enum" AS ENUM('just_starting', 'already_selling')`);
        await queryRunner.query(`CREATE TABLE "store_onboarding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "currentStep" "public"."store_onboarding_currentstep_enum" NOT NULL DEFAULT 'welcome', "businessType" "public"."store_onboarding_businesstype_enum", "salesChannels" text, "productTypes" text, "storeName" character varying, "storeUrl" character varying, "storeDescription" text, "currency" character varying, "logoUrl" character varying, "bannerUrl" character varying, "isCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_886c6026aca299ef8205fc20b23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_event_interactions_type_enum" AS ENUM('view', 'like', 'bookmark', 'share', 'register', 'attend')`);
        await queryRunner.query(`CREATE TABLE "user_event_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "type" "public"."user_event_interactions_type_enum" NOT NULL, "metadata" jsonb, "session_id" character varying(100), "user_agent" text, "ip_address" character varying(45), CONSTRAINT "UQ_9f967fc0d647e45ac0db2fa0d2e" UNIQUE ("user_id", "event_id", "type"), CONSTRAINT "PK_0a750c310a64018d15d0d0658fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_event_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "notify_updates" boolean NOT NULL DEFAULT true, "notify_reminders" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c03d4655d8c4afcf67578529389" UNIQUE ("user_id", "event_id"), CONSTRAINT "PK_35a6d1d26b31ecd0afe07bc83ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_booths_booth_type_enum" AS ENUM('standard', 'premium', 'corner', 'island', 'food', 'tech')`);
        await queryRunner.query(`CREATE TYPE "public"."event_booths_status_enum" AS ENUM('available', 'reserved', 'occupied', 'maintenance')`);
        await queryRunner.query(`CREATE TABLE "event_booths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "vendor_id" uuid, "booth_number" character varying(20) NOT NULL, "booth_type" "public"."event_booths_booth_type_enum" NOT NULL, "status" "public"."event_booths_status_enum" NOT NULL DEFAULT 'available', "section" character varying(50), "floor" character varying(20), "position_x" integer, "position_y" integer, "size_width" numeric(5,2), "size_length" numeric(5,2), "size_description" character varying(50), "base_price" numeric(10,2) NOT NULL, "premium_multiplier" numeric(3,2) NOT NULL DEFAULT '1', "has_power" boolean NOT NULL DEFAULT true, "power_outlets" integer NOT NULL DEFAULT '2', "has_wifi" boolean NOT NULL DEFAULT true, "has_storage" boolean NOT NULL DEFAULT false, "has_sink" boolean NOT NULL DEFAULT false, "max_occupancy" integer NOT NULL DEFAULT '4', "setup_time" TIMESTAMP, "breakdown_time" TIMESTAMP, "description" text, "special_requirements" text, "accessibility_features" text array, CONSTRAINT "PK_26db8f08f9415a4fc87aa82b979" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
        await queryRunner.query(`ALTER TABLE "store_onboarding" ADD CONSTRAINT "FK_bcdcf91290c4f08285ba704e4a4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_2243cd31aa080baea23909a8498" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f"`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_2243cd31aa080baea23909a8498"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5"`);
        await queryRunner.query(`ALTER TABLE "store_onboarding" DROP CONSTRAINT "FK_bcdcf91290c4f08285ba704e4a4"`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`DROP TABLE "event_booths"`);
        await queryRunner.query(`DROP TYPE "public"."event_booths_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."event_booths_booth_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_event_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_event_interactions"`);
        await queryRunner.query(`DROP TYPE "public"."user_event_interactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "store_onboarding"`);
        await queryRunner.query(`DROP TYPE "public"."store_onboarding_businesstype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."store_onboarding_currentstep_enum"`);
    }

}
