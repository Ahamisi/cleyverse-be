"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixProductHandleUniqueConstraint1760516478792 = void 0;
class FixProductHandleUniqueConstraint1760516478792 {
    name = 'FixProductHandleUniqueConstraint1760516478792';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."user_event_interactions_type_enum" AS ENUM('view', 'like', 'bookmark', 'share', 'register', 'attend')`);
        await queryRunner.query(`CREATE TABLE "user_event_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "type" "public"."user_event_interactions_type_enum" NOT NULL, "metadata" jsonb, "session_id" character varying(100), "user_agent" text, "ip_address" character varying(45), CONSTRAINT "UQ_9f967fc0d647e45ac0db2fa0d2e" UNIQUE ("user_id", "event_id", "type"), CONSTRAINT "PK_0a750c310a64018d15d0d0658fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_event_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "notify_updates" boolean NOT NULL DEFAULT true, "notify_reminders" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c03d4655d8c4afcf67578529389" UNIQUE ("user_id", "event_id"), CONSTRAINT "PK_35a6d1d26b31ecd0afe07bc83ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_booths_booth_type_enum" AS ENUM('standard', 'premium', 'corner', 'island', 'food', 'tech')`);
        await queryRunner.query(`CREATE TYPE "public"."event_booths_status_enum" AS ENUM('available', 'reserved', 'occupied', 'maintenance')`);
        await queryRunner.query(`CREATE TABLE "event_booths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "vendor_id" uuid, "booth_number" character varying(20) NOT NULL, "booth_type" "public"."event_booths_booth_type_enum" NOT NULL, "status" "public"."event_booths_status_enum" NOT NULL DEFAULT 'available', "section" character varying(50), "floor" character varying(20), "position_x" integer, "position_y" integer, "size_width" numeric(5,2), "size_length" numeric(5,2), "size_description" character varying(50), "base_price" numeric(10,2) NOT NULL, "premium_multiplier" numeric(3,2) NOT NULL DEFAULT '1', "has_power" boolean NOT NULL DEFAULT true, "power_outlets" integer NOT NULL DEFAULT '2', "has_wifi" boolean NOT NULL DEFAULT true, "has_storage" boolean NOT NULL DEFAULT false, "has_sink" boolean NOT NULL DEFAULT false, "max_occupancy" integer NOT NULL DEFAULT '4', "setup_time" TIMESTAMP, "breakdown_time" TIMESTAMP, "description" text, "special_requirements" text, "accessibility_features" text array, CONSTRAINT "PK_26db8f08f9415a4fc87aa82b979" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_463420b2b12dfc8e57c02c952e0"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3d347fa94c9a3ca447619bf76b" ON "products" ("store_id", "handle") `);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_2243cd31aa080baea23909a8498" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f"`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_2243cd31aa080baea23909a8498"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d347fa94c9a3ca447619bf76b"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_463420b2b12dfc8e57c02c952e0" UNIQUE ("handle")`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`DROP TABLE "event_booths"`);
        await queryRunner.query(`DROP TYPE "public"."event_booths_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."event_booths_booth_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_event_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_event_interactions"`);
        await queryRunner.query(`DROP TYPE "public"."user_event_interactions_type_enum"`);
    }
}
exports.FixProductHandleUniqueConstraint1760516478792 = FixProductHandleUniqueConstraint1760516478792;
//# sourceMappingURL=1760516478792-FixProductHandleUniqueConstraint.js.map