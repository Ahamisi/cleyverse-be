import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormsToEvents1760054499287 implements MigrationInterface {
    name = 'AddFormsToEvents1760054499287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_event_interactions_type_enum" AS ENUM('view', 'like', 'bookmark', 'share', 'register', 'attend')`);
        await queryRunner.query(`CREATE TABLE "user_event_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "type" "public"."user_event_interactions_type_enum" NOT NULL, "metadata" jsonb, "session_id" character varying(100), "user_agent" text, "ip_address" character varying(45), CONSTRAINT "UQ_9f967fc0d647e45ac0db2fa0d2e" UNIQUE ("user_id", "event_id", "type"), CONSTRAINT "PK_0a750c310a64018d15d0d0658fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_event_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "event_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "notify_updates" boolean NOT NULL DEFAULT true, "notify_reminders" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c03d4655d8c4afcf67578529389" UNIQUE ("user_id", "event_id"), CONSTRAINT "PK_35a6d1d26b31ecd0afe07bc83ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
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
        await queryRunner.query(`ALTER TABLE "email_verifications" ALTER COLUMN "expires_at" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`DROP TABLE "user_event_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_event_interactions"`);
        await queryRunner.query(`DROP TYPE "public"."user_event_interactions_type_enum"`);
    }

}
