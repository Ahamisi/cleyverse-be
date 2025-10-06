import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventHostUserIdNullable1759709304410 implements MigrationInterface {
    name = 'UpdateEventHostUserIdNullable1759709304410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_event_interactions_type_enum" AS ENUM('view', 'like', 'bookmark', 'share', 'register', 'attend')`);
        await queryRunner.query(`CREATE TABLE "user_event_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "type" "public"."user_event_interactions_type_enum" NOT NULL, "metadata" jsonb, "session_id" character varying(100), "user_agent" text, "ip_address" character varying(45), CONSTRAINT "UQ_9f967fc0d647e45ac0db2fa0d2e" UNIQUE ("user_id", "event_id", "type"), CONSTRAINT "PK_0a750c310a64018d15d0d0658fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_event_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "notify_updates" boolean NOT NULL DEFAULT true, "notify_reminders" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c03d4655d8c4afcf67578529389" UNIQUE ("user_id", "event_id"), CONSTRAINT "PK_35a6d1d26b31ecd0afe07bc83ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_vendor_questions_type_enum" AS ENUM('short_text', 'long_text', 'single_choice', 'multiple_choice', 'yes_no', 'number', 'email', 'phone', 'url', 'date', 'file_upload')`);
        await queryRunner.query(`CREATE TABLE "event_vendor_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "question" character varying(500) NOT NULL, "description" text, "type" "public"."event_vendor_questions_type_enum" NOT NULL, "is_required" boolean NOT NULL DEFAULT false, "display_order" integer NOT NULL DEFAULT '0', "options" text array, "min_length" integer, "max_length" integer, "min_value" numeric(10,2), "max_value" numeric(10,2), "validation_pattern" character varying(200), "validation_message" character varying(200), "allowed_file_types" text array, "max_file_size" integer, "placeholder_text" character varying(200), "help_text" character varying(500), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cc282e7f1838a5742a133aa6356" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_vendor_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "vendor_id" uuid NOT NULL, "question_id" uuid NOT NULL, "answer" text, "file_url" character varying(500), "file_name" character varying(200), CONSTRAINT "PK_a2254780332902cdfd7c9fb91f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" ADD CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_2243cd31aa080baea23909a8498" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" ADD CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_vendor_questions" ADD CONSTRAINT "FK_634e77ac3eb2053d534b9a02973" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_vendor_answers" ADD CONSTRAINT "FK_358a7b37634dac5893ee315fe6d" FOREIGN KEY ("vendor_id") REFERENCES "event_vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_vendor_answers" ADD CONSTRAINT "FK_7e8f91b5141a84301f762be9528" FOREIGN KEY ("question_id") REFERENCES "event_vendor_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_vendor_answers" DROP CONSTRAINT "FK_7e8f91b5141a84301f762be9528"`);
        await queryRunner.query(`ALTER TABLE "event_vendor_answers" DROP CONSTRAINT "FK_358a7b37634dac5893ee315fe6d"`);
        await queryRunner.query(`ALTER TABLE "event_vendor_questions" DROP CONSTRAINT "FK_634e77ac3eb2053d534b9a02973"`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_5e7d9f5e10aef0f411bb140cc6f"`);
        await queryRunner.query(`ALTER TABLE "user_event_subscriptions" DROP CONSTRAINT "FK_2243cd31aa080baea23909a8498"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_9416cc4b3bd1544f106accd2df4"`);
        await queryRunner.query(`ALTER TABLE "user_event_interactions" DROP CONSTRAINT "FK_725b26c6e0a2fcdf749d600bec5"`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`DROP TABLE "event_vendor_answers"`);
        await queryRunner.query(`DROP TABLE "event_vendor_questions"`);
        await queryRunner.query(`DROP TYPE "public"."event_vendor_questions_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_event_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_event_interactions"`);
        await queryRunner.query(`DROP TYPE "public"."user_event_interactions_type_enum"`);
    }

}
